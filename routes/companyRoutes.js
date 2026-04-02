import { Router } from 'express';
import companyController from '../controllers/companyController.js';
import { isCompany } from '../middleware/auth.js';
import { validateConsultation } from '../middleware/validation.js';

const router = Router();

router.use(isCompany);

router.get('/dashboard', companyController.dashboard);
router.get('/consultations', companyController.consultations);
router.get('/consultations/new', companyController.showNewConsultation);
router.post('/consultations', validateConsultation, companyController.createConsultation);
router.get('/consultations/:id', companyController.consultationDetail);
router.post('/consultations/:id/notes', companyController.addNote);

export default router;
