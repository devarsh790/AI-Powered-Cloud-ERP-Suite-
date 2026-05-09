import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Employee from '../../models/hr';
import { Invoice } from '../../models/finance';
import { PurchaseOrder, InventoryItem } from '../../models/supplyChain';
import Project from '../../models/project';
import Notification from '../../models/Notification';
import { sendSuccess, sendError } from '../../utils/response';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tid = req.user?.tenantId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalEmployees, activeProjects, pendingInvoices,
      lowStockItems, totalRevenue, totalExpenses,
      recentNotifications, monthlyInvoices, projectsByStatus, departmentBreakdown
    ] = await Promise.all([
      Employee.countDocuments({ tenantId: tid, status: 'active' }),
      Project.countDocuments({ tenantId: tid, status: 'active' }),
      Invoice.countDocuments({ tenantId: tid, status: { $in: ['pending', 'approved'] } }),
      InventoryItem.countDocuments({ tenantId: tid, status: 'low-stock' }),
      Invoice.aggregate([
        { $match: { tenantId: tid as any, type: 'receivable', status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Invoice.aggregate([
        { $match: { tenantId: tid as any, type: 'payable', status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Notification.find({ userId: req.user?.userId }).sort({ createdAt: -1 }).limit(5),
      Invoice.aggregate([
        { $match: { tenantId: tid as any, date: { $gte: new Date(now.getFullYear(), 0, 1) } } },
        { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$totalAmount' } } },
        { $sort: { '_id.month': 1 } }
      ]),
      Project.aggregate([
        { $match: { tenantId: tid as any } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Employee.aggregate([
        { $match: { tenantId: tid as any, status: 'active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
    ]);

    // Generate monthly revenue data for charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = months.map((name, i) => {
      const rev = monthlyInvoices.find((m: any) => m._id.month === i + 1 && m._id.type === 'receivable');
      const exp = monthlyInvoices.find((m: any) => m._id.month === i + 1 && m._id.type === 'payable');
      return { month: name, revenue: rev?.total || 0, expenses: exp?.total || 0 };
    });

    sendSuccess(res, {
      kpis: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
        totalEmployees,
        activeProjects,
        pendingInvoices,
        lowStockItems,
      },
      charts: {
        revenueByMonth,
        projectsByStatus,
        departmentBreakdown,
      },
      recentNotifications,
    });
  } catch (e: any) { sendError(res, e.message); }
};
