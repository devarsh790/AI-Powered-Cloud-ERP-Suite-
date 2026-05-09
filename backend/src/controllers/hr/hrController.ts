import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Employee, { Leave, Attendance, Payroll } from '../../models/hr';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

// ===== Employees =====
export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const total = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter).sort({ firstName: 1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, employees, total, page, limit);
  } catch (error: any) { sendError(res, error.message); }
};

export const getEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emp = await Employee.findOne({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!emp) { sendError(res, 'Employee not found', 404); return; }
    sendSuccess(res, emp);
  } catch (error: any) { sendError(res, error.message); }
};

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Employee.countDocuments({ tenantId: req.user?.tenantId });
    const emp = await Employee.create({
      ...req.body, tenantId: req.user?.tenantId,
      employeeId: `EMP-${String(count + 1).padStart(4, '0')}`,
    });
    sendSuccess(res, emp, 'Employee created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true }
    );
    if (!emp) { sendError(res, 'Employee not found', 404); return; }
    sendSuccess(res, emp, 'Employee updated');
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Leave =====
export const getLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    const leaves = await Leave.find(filter).populate('employeeId', 'firstName lastName employeeId').sort({ createdAt: -1 });
    sendSuccess(res, leaves);
  } catch (error: any) { sendError(res, error.message); }
};

export const createLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.create({ ...req.body, tenantId: req.user?.tenantId });
    sendSuccess(res, leave, 'Leave request created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      { status: req.body.status, approvedBy: req.user?.userId }, { new: true }
    );
    if (!leave) { sendError(res, 'Leave not found', 404); return; }
    sendSuccess(res, leave, `Leave ${req.body.status}`);
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Attendance =====
export const getAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    if (req.query.date) filter.date = new Date(req.query.date as string);
    if (req.query.month && req.query.year) {
      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);
      filter.date = { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) };
    }
    const records = await Attendance.find(filter).populate('employeeId', 'firstName lastName employeeId').sort({ date: -1 });
    sendSuccess(res, records);
  } catch (error: any) { sendError(res, error.message); }
};

export const clockIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let record = await Attendance.findOne({ employeeId: req.body.employeeId, tenantId: req.user?.tenantId, date: today });
    if (record) { sendError(res, 'Already clocked in today', 400); return; }
    record = await Attendance.create({
      tenantId: req.user?.tenantId, employeeId: req.body.employeeId,
      date: today, clockIn: new Date(), status: 'present',
    });
    sendSuccess(res, record, 'Clocked in', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const clockOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const record = await Attendance.findOne({ employeeId: req.body.employeeId, tenantId: req.user?.tenantId, date: today });
    if (!record) { sendError(res, 'No clock-in record found', 404); return; }
    record.clockOut = new Date();
    if (record.clockIn) {
      const diff = record.clockOut.getTime() - record.clockIn.getTime();
      record.hoursWorked = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
      record.overtime = Math.max(0, record.hoursWorked - 8);
    }
    await record.save();
    sendSuccess(res, record, 'Clocked out');
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Payroll =====
export const getPayrolls = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.month) filter.month = parseInt(req.query.month as string);
    if (req.query.year) filter.year = parseInt(req.query.year as string);
    if (req.query.status) filter.status = req.query.status;
    const payrolls = await Payroll.find(filter).populate('employeeId', 'firstName lastName employeeId department').sort({ createdAt: -1 });
    sendSuccess(res, payrolls);
  } catch (error: any) { sendError(res, error.message); }
};

export const runPayroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { month, year } = req.body;
    const employees = await Employee.find({ tenantId: req.user?.tenantId, status: 'active' });
    const results = [];
    for (const emp of employees) {
      const existing = await Payroll.findOne({ tenantId: req.user?.tenantId, employeeId: emp._id, month, year });
      if (existing) continue;
      const basic = emp.salary.basic;
      const hra = emp.salary.hra;
      const da = emp.salary.da;
      const special = emp.salary.special;
      const gross = basic + hra + da + special;
      const pf = Math.round(basic * 0.12);
      const tax = Math.round(gross > 50000 ? gross * 0.1 : gross > 30000 ? gross * 0.05 : 0);
      const totalDeductions = pf + tax;
      const netPay = gross - totalDeductions;
      const payroll = await Payroll.create({
        tenantId: req.user?.tenantId, employeeId: emp._id,
        month, year, basicPay: basic, hra, da, specialAllowance: special,
        grossPay: gross, pf, tax, totalDeductions, netPay, status: 'processed',
      });
      results.push(payroll);
    }
    sendSuccess(res, results, `Payroll processed for ${results.length} employees`, 201);
  } catch (error: any) { sendError(res, error.message); }
};

// ===== HR Summary =====
export const getHRSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;
    const [totalEmployees, byDepartment, byStatus, pendingLeaves, recentAttendance] = await Promise.all([
      Employee.countDocuments({ tenantId }),
      Employee.aggregate([{ $match: { tenantId: tenantId as any } }, { $group: { _id: '$department', count: { $sum: 1 } } }]),
      Employee.aggregate([{ $match: { tenantId: tenantId as any } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Leave.countDocuments({ tenantId, status: 'pending' }),
      Attendance.find({ tenantId }).sort({ date: -1 }).limit(10).populate('employeeId', 'firstName lastName'),
    ]);
    sendSuccess(res, { totalEmployees, byDepartment, byStatus, pendingLeaves, recentAttendance });
  } catch (error: any) { sendError(res, error.message); }
};
