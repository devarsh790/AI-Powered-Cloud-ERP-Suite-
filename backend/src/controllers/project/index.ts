import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as pc from './projectController';

const router = Router();
router.use(authenticate);

router.get('/', pc.getProjects);
router.get('/tasks/all', pc.getTasks);
router.post('/tasks', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), pc.createTask);
router.put('/tasks/:id', pc.updateTask);
router.delete('/tasks/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), pc.deleteTask);

router.get('/:id', pc.getProject);
router.post('/', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), pc.createProject);
router.put('/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), pc.updateProject);

export default router;
