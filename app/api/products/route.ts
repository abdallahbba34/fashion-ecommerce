import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (filter === 'new') {
      query.newArrival = true;
    } else if (filter === 'sale') {
      query.compareAtPrice = { $exists: true, $ne: null };
    } else if (filter === 'featured') {
      query.featured = true;
    }

    const products = await ProductModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ProductModel.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const product = await ProductModel.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
