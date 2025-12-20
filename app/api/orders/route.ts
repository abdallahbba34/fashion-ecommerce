import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import { generateOrderNumber } from '@/lib/utils';

// GET /api/orders - Get all orders (Admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await OrderModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await OrderModel.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const orderData = {
      ...body,
      orderNumber: generateOrderNumber(),
      status: 'pending',
    };

    const order = await OrderModel.create(orderData);

    // Update product stock
    const ProductModel = (await import('@/models/Product')).default;

    for (const item of orderData.items) {
      const product = await ProductModel.findById(item.productId);

      if (product) {
        // Find the variant that matches size and color
        const variantIndex = product.variants.findIndex(
          (v: any) => v.size === item.size && v.color === item.color
        );

        if (variantIndex !== -1) {
          // Decrease stock by the ordered quantity
          product.variants[variantIndex].stock -= item.quantity;

          // Ensure stock doesn't go negative
          if (product.variants[variantIndex].stock < 0) {
            product.variants[variantIndex].stock = 0;
          }

          await product.save();
        }
      }
    }

    // Here you can add:
    // - Send confirmation email
    // - Send SMS notification
    // - etc.

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
