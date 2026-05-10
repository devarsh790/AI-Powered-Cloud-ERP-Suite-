import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as ic from './integrationController';

const router = Router();
router.use(authenticate);

router.get('/openapi', ic.openApiStub);
router.get('/webhooks', ic.listWebhooks);
router.post('/webhooks', authorize('SuperAdmin', 'TenantAdmin'), ic.createWebhook);

export default router;
