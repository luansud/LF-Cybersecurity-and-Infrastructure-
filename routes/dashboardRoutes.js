import { Router } from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', dashboardController.index);

export default router;
