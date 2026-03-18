import { Router } from 'express';
import reviewController from '../controllers/reviewController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { validateReview } from '../middleware/validation.js';

const router = Router();

router.use(isAuthenticated);

router.get('/my', reviewController.myReviews);
router.get('/new', reviewController.showNewReview);
router.post('/', validateReview, reviewController.create);
router.get('/:id/edit', reviewController.showEdit);
router.post('/:id', validateReview, reviewController.update);
router.post('/:id/delete', reviewController.delete);

export default router;
