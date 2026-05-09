import { Router } from 'express';
import { register, login, refreshTokenHandler, getProfile, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokenHandler);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
