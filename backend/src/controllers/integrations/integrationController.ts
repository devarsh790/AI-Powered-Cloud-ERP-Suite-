import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';

const webhooksByTenant = new Map<string, { id: string; url: string; events: string[]; secret: string; active: boolean }[]>();

export const listWebhooks = async (req: AuthRequest, res: Response): Promise<void> => {
  const tid = String(req.user?.tenantId);
  const list = webhooksByTenant.get(tid) || [
    {
      id: 'wh_default',
      url: 'https://example.com/hooks/erp',
      events: ['invoice.approved', 'po.received'],
      secret: 'whsec_demo_placeholder',
      active: true,
    },
  ];
  sendSuccess(res, {
    webhooks: list.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      active: w.active,
      secretPreview: `${w.secret.slice(0, 8)}…`,
    })),
  });
};

export const createWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { url, events } = req.body as { url: string; events: string[] };
    if (!url || !Array.isArray(events) || events.length === 0) {
      sendError(res, 'url and events[] required', 400);
      return;
    }
    const tid = String(req.user?.tenantId);
    const prev = webhooksByTenant.get(tid) || [];
    const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`;
    const row = { id: `wh_${crypto.randomBytes(6).toString('hex')}`, url, events, secret, active: true };
    webhooksByTenant.set(tid, [...prev.filter((w) => w.id !== 'wh_default'), row]);
    sendSuccess(res, { ...row, secretPreview: row.secret }, 'Webhook created', 201);
  } catch (e: any) {
    sendError(res, e.message);
  }
};

export const dispatchWebhook = async (tenantId: string, event: string, payload: any): Promise<void> => {
  const tid = String(tenantId);
  const hooks = webhooksByTenant.get(tid);
  if (!hooks) return;

  const activeHooks = hooks.filter((h) => h.active && h.events.includes(event));
  for (const hook of activeHooks) {
    try {
      // In a real app, this would use axios/node-fetch with a signature header
      console.log(`[Webhook Dispatch] Tenant: ${tid}, Event: ${event}, URL: ${hook.url}`);
      // Simulate fetch
      // await fetch(hook.url, { method: 'POST', body: JSON.stringify({ event, payload, timestamp: new Date() }) });
    } catch (err) {
      console.error(`[Webhook Error] Failed to dispatch to ${hook.url}:`, err);
    }
  }
};

export const openApiStub = async (_req: AuthRequest, res: Response): Promise<void> => {
  sendSuccess(res, {
    openapi: '3.1.0',
    title: 'Amdox ERP API',
    version: 'v1',
    baseUrl: '/api',
    description: 'REST surface for finance, HR, supply chain, projects, notifications, audit, and AI forecast (demo bundle).',
    endpoints: [
      'GET /auth/*',
      'GET|POST /finance/*',
      'GET|POST /hr/*',
      'GET|POST /supply-chain/*',
      'GET|POST /projects/*',
      'GET /dashboard/*',
      'GET /notifications/*',
      'GET|POST /audit/*',
      'GET /ai/*',
      'GET|POST /integrations/webhooks',
    ],
  });
};
