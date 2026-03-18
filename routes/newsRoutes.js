import { Router } from 'express';
import newsController from '../controllers/newsController.js';

const router = Router();
// Define routes for news
router.get('/', newsController.index);
router.get('/article/:id', newsController.showArticle);
router.get('/:category', newsController.byCategory);

export default router;
