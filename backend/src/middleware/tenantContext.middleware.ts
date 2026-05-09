import { AuthRequest } from './auth.middleware';
import { Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const tenantContext = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user) {
    // Inject tenantId into query for all database operations
    if (!req.query.tenantId) {
      req.query.tenantId = req.user.tenantId;
    }
    // Ensure user can only access their own tenant data
    if (req.user.role !== 'SuperAdmin' && req.query.tenantId !== req.user.tenantId) {
      sendError(res, 'Access denied: tenant mismatch', 403);
      return;
    }
  }
  next();
};
