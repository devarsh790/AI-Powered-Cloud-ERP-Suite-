import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Notification from '../../models/Notification';
import { sendSuccess, sendError } from '../../utils/response';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { userId: req.user?.userId };
    if (req.query.unreadOnly === 'true') filter.isRead = false;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user?.userId, isRead: false });
    sendSuccess(res, { notifications, unreadCount });
  } catch (e: any) { sendError(res, e.message); }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, { isRead: true });
    sendSuccess(res, null, 'Marked as read');
  } catch (e: any) { sendError(res, e.message); }
};

export const markAllRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ userId: req.user?.userId, isRead: false }, { isRead: true });
    sendSuccess(res, null, 'All marked as read');
  } catch (e: any) { sendError(res, e.message); }
};
