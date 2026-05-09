import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as sc from './scmController';

const router = Router();
router.use(authenticate);

router.get('/vendors', sc.getVendors);
router.post('/vendors', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.createVendor);
router.put('/vendors/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.updateVendor);

router.get('/purchase-orders', sc.getPurchaseOrders);
router.post('/purchase-orders', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.createPurchaseOrder);
router.put('/purchase-orders/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.updatePurchaseOrder);

router.get('/inventory', sc.getInventory);
router.post('/inventory', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.createInventoryItem);
router.put('/inventory/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), sc.updateInventoryItem);

router.get('/summary', sc.getSCMSummary);

export default router;
