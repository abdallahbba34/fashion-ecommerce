import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import ProductModel from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminData = verifyAdmin(request);
    if (!adminData) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get current date info
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total orders
    const totalOrders = await OrderModel.countDocuments();

    // Orders this month
    const ordersThisMonth = await OrderModel.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Orders last month
    const ordersLastMonth = await OrderModel.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    // Calculate orders change percentage
    const ordersChange = ordersLastMonth > 0
      ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
      : 100;

    // Total products
    const totalProducts = await ProductModel.countDocuments();

    // Products added this month
    const productsThisMonth = await ProductModel.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Total customers (unique emails from orders)
    const uniqueCustomers = await OrderModel.distinct('guestEmail');
    const totalCustomers = uniqueCustomers.filter((email) => email).length;

    // Customers this month
    const customersThisMonthData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth }
        }
      },
      {
        $group: {
          _id: '$guestEmail'
        }
      }
    ]);
    const customersThisMonth = customersThisMonthData.filter((c) => c._id).length;

    // Customers last month
    const customersLastMonthData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
        }
      },
      {
        $group: {
          _id: '$guestEmail'
        }
      }
    ]);
    const customersLastMonth = customersLastMonthData.filter((c) => c._id).length;

    // Calculate customers change percentage
    const customersChange = customersLastMonth > 0
      ? Math.round(((customersThisMonth - customersLastMonth) / customersLastMonth) * 100)
      : 100;

    // Total revenue
    const revenueData = await OrderModel.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Revenue this month
    const revenueThisMonthData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth },
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const revenueThisMonth = revenueThisMonthData.length > 0 ? revenueThisMonthData[0].total : 0;

    // Revenue last month
    const revenueLastMonthData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const revenueLastMonth = revenueLastMonthData.length > 0 ? revenueLastMonthData[0].total : 0;

    // Calculate revenue change percentage
    const revenueChange = revenueLastMonth > 0
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
      : 100;

    // Recent orders
    const recentOrders = await OrderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber shippingAddress.fullName createdAt total status');

    return NextResponse.json({
      stats: {
        orders: {
          total: totalOrders,
          change: ordersChange,
          positive: ordersChange >= 0,
        },
        products: {
          total: totalProducts,
          change: productsThisMonth,
          positive: true,
        },
        customers: {
          total: totalCustomers,
          change: customersChange,
          positive: customersChange >= 0,
        },
        revenue: {
          total: totalRevenue,
          change: revenueChange,
          positive: revenueChange >= 0,
        },
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
