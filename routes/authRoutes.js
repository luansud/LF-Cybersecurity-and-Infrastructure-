import { Router } from 'express';
import authController from '../controllers/authController.js';
import { isGuest } from '../middleware/auth.js';
import { validateLogin, validateRegistration } from '../middleware/validation.js';

const router = Router();
// Authentication routes
router.get('/login', isGuest, authController.showLogin);
router.post('/login', isGuest, validateLogin, authController.login);
router.get('/register', isGuest, authController.showRegister);
router.post('/register', isGuest, validateRegistration, authController.register);
router.post('/logout', authController.logout);

export default router;
