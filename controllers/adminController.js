import userModel from '../models/userModel.js';
import newsModel from '../models/newsModel.js';
import consultationModel from '../models/consultationModel.js';
import ticketModel from '../models/ticketModel.js';
import reviewModel from '../models/reviewModel.js';
import contentModel from '../models/contentModel.js';

const adminController = {
  // GET /admin
  async dashboard(req, res, next) {
    try {
      const users = await userModel.getAll();
      const userCounts = await userModel.getCountByRole();
      const consultationCounts = await consultationModel.getCountByStatus();
      const ticketCounts = await ticketModel.getCountByStatus();
      const reviews = await reviewModel.getAll();

      const pendingReviews = reviews.filter(r => !r.is_approved && !r.is_flagged).length;
      const openTickets = ticketCounts.find(t => t.status === 'open')?.count || 0;
      const activeConsultations = consultationCounts
        .filter(c => !['completed', 'cancelled'].includes(c.status))
        .reduce((sum, c) => sum + parseInt(c.count), 0);

      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        totalUsers: users.length,
        userCounts,
        openTickets,
        activeConsultations,
        pendingReviews,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/users
  async users(req, res, next) {
    try {
      const users = await userModel.getAll();
      res.render('admin/users', { title: 'Manage Users', users });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/users/:id/role
  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      await userModel.updateRole(req.params.id, role);
      req.flash('success', 'User role updated.');
      res.redirect('/admin/users');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/users/:id/toggle
  async toggleUser(req, res, next) {
    try {
      await userModel.toggleActive(req.params.id);
      req.flash('success', 'User status updated.');
      res.redirect('/admin/users');
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/news
  async news(req, res, next) {
    try {
      const articles = await newsModel.getAll();
      res.render('admin/news', { title: 'Manage News', articles });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/news/new
  showNewArticle(req, res) {
    res.render('admin/news-form', { title: 'New Article', article: null });
  },

  // POST /admin/news
  async createArticle(req, res, next) {
    try {
      const { title, summary, content, category, image_url } = req.body;
      await newsModel.create({
        title, summary, content, category, image_url,
        author_id: req.session.user.id,
      });
      req.flash('success', 'Article created.');
      res.redirect('/admin/news');
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/news/:id/edit
  async editArticle(req, res, next) {
    try {
      const article = await newsModel.getById(req.params.id);
      if (!article) {
        req.flash('error', 'Article not found.');
        return res.redirect('/admin/news');
      }
      res.render('admin/news-form', { title: 'Edit Article', article });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/news/:id
  async updateArticle(req, res, next) {
    try {
      const { title, summary, content, category, image_url } = req.body;
      await newsModel.update(req.params.id, { title, summary, content, category, image_url });
      req.flash('success', 'Article updated.');
      res.redirect('/admin/news');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/news/:id/toggle
  async toggleArticle(req, res, next) {
    try {
      await newsModel.togglePublished(req.params.id);
      req.flash('success', 'Article publish status updated.');
      res.redirect('/admin/news');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/news/:id/delete
  async deleteArticle(req, res, next) {
    try {
      await newsModel.delete(req.params.id);
      req.flash('success', 'Article deleted.');
      res.redirect('/admin/news');
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/consultations
  async consultations(req, res, next) {
    try {
      const consultations = await consultationModel.getAll();
      res.render('admin/consultations', { title: 'Manage Consultations', consultations });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/consultations/:id
  async consultationDetail(req, res, next) {
    try {
      const consultation = await consultationModel.getById(req.params.id);
      if (!consultation) {
        req.flash('error', 'Consultation not found.');
        return res.redirect('/admin/consultations');
      }
      const notes = await consultationModel.getNotes(consultation.id);
      res.render('admin/consultation-detail', {
        title: consultation.title,
        consultation,
        notes,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/consultations/:id/status
  async updateConsultationStatus(req, res, next) {
    try {
      const { status } = req.body;
      await consultationModel.updateStatus(req.params.id, status);
      req.flash('success', 'Consultation status updated.');
      res.redirect(`/admin/consultations/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/consultations/:id/notes
  async addConsultationNote(req, res, next) {
    try {
      await consultationModel.addNote({
        consultation_id: req.params.id,
        user_id: req.session.user.id,
        note: req.body.note,
      });
      req.flash('success', 'Note added.');
      res.redirect(`/admin/consultations/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/tickets
  async tickets(req, res, next) {
    try {
      const tickets = await ticketModel.getAll();
      res.render('admin/tickets', { title: 'Manage Tickets', tickets });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/tickets/:id
  async ticketDetail(req, res, next) {
    try {
      const ticket = await ticketModel.getById(req.params.id);
      if (!ticket) {
        req.flash('error', 'Ticket not found.');
        return res.redirect('/admin/tickets');
      }
      const responses = await ticketModel.getResponses(ticket.id);
      res.render('admin/ticket-detail', {
        title: `Ticket #${ticket.id}`,
        ticket,
        responses,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/tickets/:id/status
  async updateTicketStatus(req, res, next) {
    try {
      await ticketModel.updateStatus(req.params.id, req.body.status);
      req.flash('success', 'Ticket status updated.');
      res.redirect(`/admin/tickets/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/tickets/:id/respond
  async respondToTicket(req, res, next) {
    try {
      await ticketModel.addResponse({
        ticket_id: req.params.id,
        user_id: req.session.user.id,
        message: req.body.message,
      });
      req.flash('success', 'Response sent.');
      res.redirect(`/admin/tickets/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/reviews
  async reviews(req, res, next) {
    try {
      const reviews = await reviewModel.getAll();
      res.render('admin/reviews', { title: 'Manage Reviews', reviews });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/reviews/:id/approve
  async approveReview(req, res, next) {
    try {
      await reviewModel.approve(req.params.id);
      req.flash('success', 'Review approved.');
      res.redirect('/admin/reviews');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/reviews/:id/flag
  async flagReview(req, res, next) {
    try {
      await reviewModel.flag(req.params.id);
      req.flash('success', 'Review flagged.');
      res.redirect('/admin/reviews');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/reviews/:id/delete
  async deleteReview(req, res, next) {
    try {
      await reviewModel.delete(req.params.id);
      req.flash('success', 'Review deleted.');
      res.redirect('/admin/reviews');
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/content
  async content(req, res, next) {
    try {
      const allContent = await contentModel.getAll();
      res.render('admin/content', { title: 'Manage Site Content', allContent });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/content
  async updateContent(req, res, next) {
    try {
      const { section, content_key, content_value } = req.body;
      await contentModel.upsert(section, content_key, content_value, req.session.user.id);
      req.flash('success', 'Content updated.');
      res.redirect('/admin/content');
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;
