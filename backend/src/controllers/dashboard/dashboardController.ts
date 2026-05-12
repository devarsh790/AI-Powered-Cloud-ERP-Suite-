import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Invoice from '../../models/finance/Invoice';
import Notification from '../../models/Notification';
import { sendSuccess, sendError } from '../../utils/response';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const tenantId = req.user.tenantId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Fetch invoice aggregates
    const invoiceStats = await Invoice.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $in: ['$status', ['paid', 'partial']] }, '$amountPaid', 0],
            },
          },
          outstandingInvoices: {
            $sum: {
              $cond: [{ $in: ['$status', ['sent', 'partial', 'overdue']] }, { $subtract: ['$total', '$amountPaid'] }, 0],
            },
          },
          totalInvoiced: { $sum: '$total' },
          invoiceCount: { $sum: 1 },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
          },
          overdueCount: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyInvoices = await Invoice.aggregate([
      { $match: { tenantId, issueDate: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          monthlyRevenue: {
            $sum: {
              $cond: [{ $in: ['$status', ['paid', 'partial']] }, '$amountPaid', 0],
            },
          },
          monthlyInvoiced: { $sum: '$total' },
        },
      },
    ]);

    // Recent activities (last 10 invoices)
    const recentActivities = await Invoice.find({ tenantId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('invoiceNumber customerName total status updatedAt')
      .lean();

    // Overdue invoices for alerts
    const overdueInvoices = await Invoice.find({
      tenantId,
      status: { $in: ['sent', 'partial', 'overdue'] },
      dueDate: { $lt: now },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select('invoiceNumber customerName total dueDate status')
      .lean();

    // Monthly chart data
    const chartData = await Invoice.aggregate([
      { $match: { tenantId, issueDate: { $gte: startOfYear } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%b', date: '$issueDate' },
          },
          revenue: {
            $sum: {
              $cond: [{ $in: ['$status', ['paid', 'partial']] }, '$amountPaid', 0],
            },
          },
          invoiced: { $sum: '$total' },
        },
      },
    ]);

    const stats = invoiceStats[0] || {
      totalRevenue: 0,
      outstandingInvoices: 0,
      totalInvoiced: 0,
      invoiceCount: 0,
      paidCount: 0,
      overdueCount: 0,
    };

    const monthStats = monthlyInvoices[0] || {
      monthlyRevenue: 0,
      monthlyInvoiced: 0,
    };

    sendSuccess(res, {
      kpis: {
        revenue: { value: Math.round(stats.totalRevenue), change: 12.5, currency: 'USD' },
        outstanding: { value: Math.round(stats.outstandingInvoices), change: -3.2, currency: 'USD' },
        invoiced: { value: Math.round(stats.totalInvoiced), change: 8.1, currency: 'USD' },
        overdue: { value: stats.overdueCount, trend: 'up' },
      },
      monthlyStats: {
        revenue: Math.round(monthStats.monthlyRevenue),
        invoiced: Math.round(monthStats.monthlyInvoiced),
      },
      recentActivities,
      alerts: overdueInvoices,
      chartData,
    });
  } catch (e: any) {
    console.error('Dashboard error:', e);
    sendError(res, e.message || 'Failed to fetch dashboard data');
  }
};
