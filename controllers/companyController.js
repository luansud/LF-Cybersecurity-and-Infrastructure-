import companyModel from '../models/companyModel.js';
import consultationModel from '../models/consultationModel.js';
import ticketModel from '../models/ticketModel.js';
import reviewModel from '../models/reviewModel.js';

const companyController = {
  // GET /company/dashboard
  async dashboard(req, res, next) {
    try {
      const userId = req.session.user.id;
      const company = await companyModel.getByUserId(userId);

      if (!company) {
        req.flash('error', 'Company profile not found.');
        return res.redirect('/');
      }

      const consultations = await consultationModel.getByCompanyId(company.id);
      const tickets = await ticketModel.getByUserId(userId);
      const reviews = await reviewModel.getByUserId(userId);

      const activeConsultations = consultations.filter(c => !['completed', 'cancelled'].includes(c.status));

      res.render('company/dashboard', {
        title: 'Company Dashboard',
        company,
        consultations,
        activeConsultations,
        tickets,
        reviews,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /company/consultations
  async consultations(req, res, next) {
    try {
      const company = await companyModel.getByUserId(req.session.user.id);
      const consultations = await consultationModel.getByCompanyId(company.id);

      res.render('company/consultations', {
        title: 'My Consultations',
        consultations,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /company/consultations/new
  showNewConsultation(req, res) {
    res.render('company/consultation-new', {
      title: 'Request Consultation',
    });
  },

  // POST /company/consultations
  async createConsultation(req, res, next) {
    try {
      const company = await companyModel.getByUserId(req.session.user.id);
      const { title, description, priority } = req.body;

      await consultationModel.create({
        company_id: company.id,
        title,
        description,
        priority: priority || 'medium',
      });

      req.flash('success', 'Consultation request submitted successfully!');
      res.redirect('/company/consultations');
    } catch (err) {
      next(err);
    }
  },

  // GET /company/consultations/:id
  async consultationDetail(req, res, next) {
    try {
      const company = await companyModel.getByUserId(req.session.user.id);
      const consultation = await consultationModel.getById(req.params.id);

      if (!consultation || consultation.company_id !== company.id) {
        req.flash('error', 'Consultation not found.');
        return res.redirect('/company/consultations');
      }

      const notes = await consultationModel.getNotes(consultation.id);

      res.render('company/consultation-detail', {
        title: consultation.title,
        consultation,
        notes,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /company/consultations/:id/notes
  async addNote(req, res, next) {
    try {
      const company = await companyModel.getByUserId(req.session.user.id);
      const consultation = await consultationModel.getById(req.params.id);

      if (!consultation || consultation.company_id !== company.id) {
        req.flash('error', 'Consultation not found.');
        return res.redirect('/company/consultations');
      }

      await consultationModel.addNote({
        consultation_id: consultation.id,
        user_id: req.session.user.id,
        note: req.body.note,
      });

      req.flash('success', 'Note added.');
      res.redirect(`/company/consultations/${consultation.id}`);
    } catch (err) {
      next(err);
    }
  },

};

export default companyController;
