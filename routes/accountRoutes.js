import { Router } from 'express';
import accountController from '../controllers/accountController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', accountController.showAccount);
router.post('/profile', accountController.updateProfile);
router.post('/password', accountController.changePassword);
router.post('/notifications', accountController.updateNotifications);
router.post('/delete', accountController.deleteAccount);

export default router;