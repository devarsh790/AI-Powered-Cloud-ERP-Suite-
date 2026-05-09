import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as hr from './hrController';

const router = Router();
router.use(authenticate);

router.get('/employees', hr.getEmployees);
router.get('/employees/:id', hr.getEmployee);
router.post('/employees', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), hr.createEmployee);
router.put('/employees/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), hr.updateEmployee);

router.get('/leaves', hr.getLeaves);
router.post('/leaves', hr.createLeave);
router.put('/leaves/:id/status', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), hr.updateLeaveStatus);

router.get('/attendance', hr.getAttendance);
router.post('/attendance/clock-in', hr.clockIn);
router.post('/attendance/clock-out', hr.clockOut);

router.get('/payroll', hr.getPayrolls);
router.post('/payroll/run', authorize('SuperAdmin', 'TenantAdmin'), hr.runPayroll);

router.get('/summary', hr.getHRSummary);

export default router;
