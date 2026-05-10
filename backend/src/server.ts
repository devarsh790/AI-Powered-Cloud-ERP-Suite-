import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import env from './config/env';
import { connectDatabase, isDatabaseReady } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler.middleware';

// Route imports
import authRoutes from './routes/authRoutes';
import financeRoutes from './controllers/finance';
import hrRoutes from './controllers/hr';
import scmRoutes from './controllers/supplyChain';
import projectRoutes from './controllers/project';
import dashboardRoutes from './controllers/dashboard';
import notificationRoutes from './controllers/notification';
import auditRoutes from './controllers/audit';
import aiRoutes from './controllers/ai';
import integrationRoutes from './controllers/integrations';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Health checks (F-11 / ops alignment)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'amdox-erp-api' });
});
app.get('/api/health/live', (_req, res) => {
  res.json({ status: 'live', timestamp: new Date().toISOString() });
});
app.get('/api/health/ready', (_req, res) => {
  const ok = isDatabaseReady();
  res.status(ok ? 200 : 503).json({
    status: ok ? 'ready' : 'not_ready',
    database: ok ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/supply-chain', scmRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/integrations', integrationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    logger.info(`🚀 Amdox ERP API running on port ${env.PORT}`);
    logger.info(`📋 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 API Base: http://localhost:${env.PORT}/api`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
