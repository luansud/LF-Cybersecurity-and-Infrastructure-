import { Router } from 'express';
import homeController from '../controllers/homeController.js';

const router = Router();
// Public routes
router.get('/', homeController.showHome);
router.get('/course', homeController.showCourse);
router.get('/consulting', homeController.showConsulting);
router.get('/about', homeController.showAbout);

export default router;
