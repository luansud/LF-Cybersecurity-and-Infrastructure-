import ticketModel from '../models/ticketModel.js';

const ticketController = {
  // GET /tickets/my
  async myTickets(req, res, next) {
    try {
      const tickets = await ticketModel.getByUserId(req.session.user.id);
      res.render('dashboard/tickets', { title: 'My Tickets', tickets });
    } catch (err) {
      next(err);
    }
  },

  // GET /tickets/new
  showNewTicket(req, res) {
    res.render('dashboard/ticket-form', { title: 'New Ticket' });
  },

  // POST /tickets
  async create(req, res, next) {
    try {
      const { subject, message, category, priority } = req.body;
      await ticketModel.create({
        user_id: req.session.user.id,
        subject,
        message,
        category,
        priority: priority || 'medium',
      });
      req.flash('success', 'Ticket submitted successfully!');
      res.redirect('/tickets/my');
    } catch (err) {
      next(err);
    }
  },

  // GET /tickets/:id
  async detail(req, res, next) {
    try {
      const ticket = await ticketModel.getById(req.params.id);
      if (!ticket || ticket.user_id !== req.session.user.id) {
        req.flash('error', 'Ticket not found.');
        return res.redirect('/tickets/my');
      }

      const responses = await ticketModel.getResponses(ticket.id);
      res.render('dashboard/ticket-detail', {
        title: `Ticket #${ticket.id}`,
        ticket,
        responses,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /tickets/:id/respond
  async respond(req, res, next) {
    try {
      const ticket = await ticketModel.getById(req.params.id);
      if (!ticket || ticket.user_id !== req.session.user.id) {
        req.flash('error', 'Ticket not found.');
        return res.redirect('/tickets/my');
      }

      await ticketModel.addResponse({
        ticket_id: ticket.id,
        user_id: req.session.user.id,
        message: req.body.message,
      });

      req.flash('success', 'Response added.');
      res.redirect(`/tickets/${ticket.id}`);
    } catch (err) {
      next(err);
    }
  },
};

export default ticketController;
