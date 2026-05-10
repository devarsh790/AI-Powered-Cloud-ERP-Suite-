import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';

/** Demo SKU demand forecast — simulates Prophet-style seasonality + trend (F-06). */
export const getForecast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sku = (req.query.sku as string) || 'SKU-DEFAULT';
    const horizon = Math.min(parseInt(req.query.horizon as string, 10) || 90, 180);
    const base = 80 + (sku.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 40);
    const now = Date.now();
    const points: { date: string; actual?: number; forecast: number; lower: number; upper: number }[] = [];
    for (let d = -30; d < horizon; d++) {
      const t = new Date(now + d * 86400000);
      const day = t.getUTCDay();
      const seasonal = 1 + 0.12 * Math.sin((2 * Math.PI * d) / 7) + 0.05 * (day === 0 || day === 6 ? -1 : 0);
      const trend = 1 + d * 0.002;
      const y = Math.round(base * seasonal * trend + (Math.sin(d / 11) * 6));
      const iso = t.toISOString().slice(0, 10);
      if (d < 0) {
        points.push({ date: iso, actual: y + Math.round((Math.random() - 0.5) * 8), forecast: y, lower: y - 12, upper: y + 12 });
      } else {
        const noise = Math.round((Math.random() - 0.5) * 5);
        const fc = y + noise;
        points.push({ date: iso, forecast: fc, lower: fc - 15, upper: fc + 18 });
      }
    }
    sendSuccess(res, {
      sku,
      model: 'prophet-demo-v1',
      mapeEstimate: 10.2 + (sku.length % 5) * 0.4,
      horizonDays: horizon,
      retrainSchedule: 'weekly',
      series: points,
    });
  } catch (e: any) {
    sendError(res, e.message);
  }
};

export const mlHealth = async (_req: AuthRequest, res: Response): Promise<void> => {
  sendSuccess(res, { status: 'ok', service: 'forecast-demo', version: '1.0.0' });
};
