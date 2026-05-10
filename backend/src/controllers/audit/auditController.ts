import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../../middleware/auth.middleware';
import AuditLog from '../../models/AuditLog';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';
import { dispatchWebhook } from '../integrations/integrationController';

const hashPayload = (tenantId: string, action: string, module: string, at: string, prev?: string) =>
  crypto.createHash('sha256').update(`${prev || 'genesis'}|${tenantId}|${action}|${module}|${at}`).digest('hex');

export const listAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 30, 100);
    const filter: Record<string, unknown> = { tenantId: req.user?.tenantId };
    if (req.query.module) filter.module = req.query.module;
    if (req.query.action) filter.action = req.query.action;
    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    sendPaginated(res, logs, total, page, limit);
  } catch (e: any) {
    sendError(res, e.message);
  }
};

export const appendAuditLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action, module, resourceType, resourceId, details } = req.body as {
      action: string;
      module: string;
      resourceType?: string;
      resourceId?: string;
      details?: Record<string, unknown>;
    };
    if (!action || !module) {
      sendError(res, 'action and module are required', 400);
      return;
    }
    const tid = req.user?.tenantId;
    const last = await AuditLog.findOne({ tenantId: tid }).sort({ createdAt: -1 }).select('entryHash').lean();
    const at = new Date().toISOString();
    const entryHash = hashPayload(String(tid), action, module, at, last?.entryHash);
    const log = await AuditLog.create({
      tenantId: tid,
      actorId: req.user?.userId,
      actorEmail: req.user?.email || 'unknown',
      action,
      module,
      resourceType,
      resourceId,
      details: details || {},
      ip: req.ip,
      prevHash: last?.entryHash,
      entryHash,
    });

    // Trigger webhook if action is critical (F-11)
    if (action.includes('OVERRUN') || action.includes('SECURITY')) {
      dispatchWebhook(String(tid), `audit.${action.toLowerCase().replace(/ /g, '_')}`, log);
    }

    sendSuccess(res, log, 'Audit entry recorded', 201);
  } catch (e: any) {
    sendError(res, e.message);
  }
};

export const gdprQueueStub = async (_req: AuthRequest, res: Response): Promise<void> => {
  sendSuccess(res, {
    message: 'Data subject request intake (demo)',
    slaHours: 72,
    openRequests: [
      { id: 'DSR-1042', type: 'export', status: 'in_progress', openedAt: new Date().toISOString() },
      { id: 'DSR-1040', type: 'erasure', status: 'queued', openedAt: new Date().toISOString() },
    ],
  });
};
