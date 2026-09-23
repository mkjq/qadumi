import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teachersCount = await prisma.teacher.count({ where: { isActive: true } });
    const messagesCount = await prisma.contactMessage.count();
    const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } });
    const ordersCount = await prisma.order.count();
    
    // Calculate total revenue from APPROVED orders
    const approvedOrders = await prisma.order.findMany({
      where: { status: 'APPROVED' },
      include: { courseCard: true },
    });
    const totalRevenue = approvedOrders.reduce((sum, order) => sum + (order.courseCard?.price || 0), 0);

    // Get last 7 days chart data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: { courseCard: true },
    });

    // Group by date
    const chartDataMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      chartDataMap[dateStr] = { date: dateStr, orders: 0, revenue: 0 };
    }

    recentOrders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (chartDataMap[dateStr]) {
        chartDataMap[dateStr].orders += 1;
        if (order.status === 'APPROVED') {
          chartDataMap[dateStr].revenue += (order.courseCard?.price || 0);
        }
      }
    });

    const chartData = Object.values(chartDataMap);

    return NextResponse.json({
      teachersCount,
      messagesCount,
      unreadMessages,
      ordersCount,
      totalRevenue,
      chartData,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
