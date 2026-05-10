import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as ac from './auditController';

const router = Router();
router.use(authenticate);

router.get('/logs', ac.listAuditLogs);
router.post('/events', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), ac.appendAuditLog);
router.get('/gdpr/requests', ac.gdprQueueStub);

export default router;
