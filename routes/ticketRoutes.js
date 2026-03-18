import { Router } from 'express';
import ticketController from '../controllers/ticketController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { validateTicket } from '../middleware/validation.js';

const router = Router();

router.use(isAuthenticated);

router.get('/my', ticketController.myTickets);
router.get('/new', ticketController.showNewTicket);
router.post('/', validateTicket, ticketController.create);
router.get('/:id', ticketController.detail);
router.post('/:id/respond', ticketController.respond);

export default router;
