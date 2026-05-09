import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getDashboardData } from './dashboardController';

const router = Router();
router.use(authenticate);
router.get('/', getDashboardData);

export default router;
