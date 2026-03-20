import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { isAdmin } from '../middleware/auth.js';
import { validateArticle } from '../middleware/validation.js';

const router = Router();

router.use(isAdmin);

// Dashboard
router.get('/', adminController.dashboard);

// Users
router.get('/users', adminController.users);
router.post('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/toggle', adminController.toggleUser);

// News
router.get('/news', adminController.news);
router.get('/news/new', adminController.showNewArticle);
router.post('/news', validateArticle, adminController.createArticle);
router.get('/news/:id/edit', adminController.editArticle);
router.post('/news/:id', validateArticle, adminController.updateArticle);
router.post('/news/:id/toggle', adminController.toggleArticle);
router.post('/news/:id/delete', adminController.deleteArticle);

// Consultations
router.get('/consultations', adminController.consultations);
router.get('/consultations/:id', adminController.consultationDetail);
router.post('/consultations/:id/status', adminController.updateConsultationStatus);
router.post('/consultations/:id/notes', adminController.addConsultationNote);

// Tickets
router.get('/tickets', adminController.tickets);
router.get('/tickets/:id', adminController.ticketDetail);
router.post('/tickets/:id/status', adminController.updateTicketStatus);
router.post('/tickets/:id/respond', adminController.respondToTicket);

// Reviews
router.get('/reviews', adminController.reviews);
router.post('/reviews/:id/approve', adminController.approveReview);
router.post('/reviews/:id/flag', adminController.flagReview);
router.post('/reviews/:id/delete', adminController.deleteReview);

// Site Content
router.get('/content', adminController.content);
router.post('/content', adminController.updateContent);

export default router;
