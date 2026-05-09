import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Project, { Task } from '../../models/project';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter).populate('managerId', 'firstName lastName').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, projects, total, page, limit);
  } catch (e: any) { sendError(res, e.message); }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const p = await Project.findOne({ _id: req.params.id, tenantId: req.user?.tenantId }).populate('managerId', 'firstName lastName').populate('teamMembers', 'firstName lastName');
    if (!p) { sendError(res, 'Project not found', 404); return; }
    const tasks = await Task.find({ projectId: p._id, tenantId: req.user?.tenantId }).populate('assigneeId', 'firstName lastName').sort({ order: 1 });
    sendSuccess(res, { project: p, tasks });
  } catch (e: any) { sendError(res, e.message); }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Project.countDocuments({ tenantId: req.user?.tenantId });
    const p = await Project.create({ ...req.body, tenantId: req.user?.tenantId, projectCode: `PRJ-${String(count + 1).padStart(4, '0')}` });
    sendSuccess(res, p, 'Project created', 201);
  } catch (e: any) { sendError(res, e.message); }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const p = await Project.findOneAndUpdate({ _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true });
    if (!p) { sendError(res, 'Project not found', 404); return; }
    sendSuccess(res, p, 'Project updated');
  } catch (e: any) { sendError(res, e.message); }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assigneeId) filter.assigneeId = req.query.assigneeId;
    const tasks = await Task.find(filter).populate('assigneeId', 'firstName lastName').populate('projectId', 'name projectCode').sort({ order: 1 });
    sendSuccess(res, tasks);
  } catch (e: any) { sendError(res, e.message); }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const t = await Task.create({ ...req.body, tenantId: req.user?.tenantId });
    sendSuccess(res, t, 'Task created', 201);
  } catch (e: any) { sendError(res, e.message); }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const t = await Task.findOneAndUpdate({ _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true });
    if (!t) { sendError(res, 'Task not found', 404); return; }
    // Update project progress
    const tasks = await Task.find({ projectId: t.projectId, tenantId: req.user?.tenantId });
    const done = tasks.filter(tk => tk.status === 'done').length;
    const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    await Project.findByIdAndUpdate(t.projectId, { progress });
    sendSuccess(res, t, 'Task updated');
  } catch (e: any) { sendError(res, e.message); }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    sendSuccess(res, null, 'Task deleted');
  } catch (e: any) { sendError(res, e.message); }
};
