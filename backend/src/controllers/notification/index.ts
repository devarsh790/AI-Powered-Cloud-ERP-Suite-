import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getNotifications, markAsRead, markAllRead } from './notifController';

const router = Router();
router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);

export default router;
