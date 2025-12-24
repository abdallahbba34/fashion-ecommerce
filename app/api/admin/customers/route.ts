import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import { getWilayaId } from '@/lib/yalidine-wilayas';

interface CustomerData {
  name: string;
  phone: string;
  wilaya: string;
  wilayaCode: number;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date;
  status: 'pending' | 'delivered';
  pendingOrderId?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get all orders
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Group orders by customer (phone number as unique identifier)
    const customersMap = new Map<string, CustomerData>();

    for (const order of orders) {
      const phone = order.shippingAddress.phone;
      const wilayaCode = getWilayaId(order.shippingAddress.wilaya) || 0;

      if (customersMap.has(phone)) {
        const customer = customersMap.get(phone)!;
        customer.orderCount += 1;
        customer.totalSpent += order.total;

        // Update status if any order is delivered
        if (order.status === 'delivered') {
          customer.status = 'delivered';
        }

        // Set pending order ID if this order is pending and not yet sent to Yalidine
        if (order.status !== 'delivered' && !order.trackingNumber && !customer.pendingOrderId) {
          customer.pendingOrderId = order._id.toString();
        }

        // Update last order date if more recent
        if (order.createdAt > customer.lastOrderDate) {
          customer.lastOrderDate = order.createdAt;
        }
      } else {
        customersMap.set(phone, {
          name: order.shippingAddress.fullName,
          phone: order.shippingAddress.phone,
          wilaya: order.shippingAddress.wilaya,
          wilayaCode,
          orderCount: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt,
          status: order.status === 'delivered' ? 'delivered' : 'pending',
          pendingOrderId: (order.status !== 'delivered' && !order.trackingNumber) ? order._id.toString() : undefined,
        });
      }
    }

    // Convert map to array and sort by last order date
    const customers = Array.from(customersMap.values())
      .sort((a, b) => b.lastOrderDate.getTime() - a.lastOrderDate.getTime());

    return NextResponse.json({
      customers,
      total: customers.length,
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
