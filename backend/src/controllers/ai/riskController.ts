import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Project from '../../models/project';
import { sendSuccess, sendError } from '../../utils/response';

/** 
 * AI Risk Engine (F-06/F-07)
 * Analyzes projects for budget overruns, deadline risks, and performance bottlenecks.
 */
export const getRiskAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;
    const projects = await Project.find({ tenantId, status: 'active' }).lean();

    const risks = projects.map(p => {
      const budget = p.budget;
      const budgetUsage = budget.planned > 0 ? (budget.actual / budget.planned) : 0;
      const progress = p.progress || 0;
      
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let message = 'Project performing within parameters.';
      
      // Budget risk
      if (budgetUsage > 1.1) {
        severity = 'critical';
        message = `Budget overrun: ${Math.round((budgetUsage - 1) * 100)}% above plan.`;
      } else if (budgetUsage > 0.9 && progress < 80) {
        severity = 'high';
        message = 'High budget consumption relative to progress.';
      }
      
      // Timeline risk
      const now = new Date();
      const end = new Date(p.endDate);
      const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      if (remainingDays < 7 && progress < 90) {
        severity = severity === 'critical' ? 'critical' : 'high';
        message += ` Deadline approaching (${remainingDays} days left) with ${100 - progress}% work remaining.`;
      }

      return {
        projectId: p._id,
        projectName: p.name,
        projectCode: p.projectCode,
        severity,
        message,
        metrics: {
          budgetUsage,
          progress,
          remainingDays
        }
      };
    }).filter(r => r.severity !== 'low');

    sendSuccess(res, {
      summary: {
        totalActive: projects.length,
        atRisk: risks.length,
        criticalCount: risks.filter(r => r.severity === 'critical').length
      },
      risks
    });
  } catch (e: any) {
    sendError(res, e.message);
  }
};
