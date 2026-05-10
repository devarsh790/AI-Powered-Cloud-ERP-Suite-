import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as fc from './forecastController';
import * as risk from './riskController';

const router = Router();
router.use(authenticate);

router.get('/forecast', fc.getForecast);
router.get('/risk', risk.getRiskAssessment);
router.get('/health', fc.mlHealth);

export default router;
