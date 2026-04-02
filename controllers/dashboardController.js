import reviewModel from '../models/reviewModel.js';
import ticketModel from '../models/ticketModel.js';
import contentModel from '../models/contentModel.js';

const dashboardController = {
  // GET /dashboard
  async index(req, res, next) {
    try {
      const userId = req.session.user.id;
      const reviews = await reviewModel.getByUserId(userId);
      const tickets = await ticketModel.getByUserId(userId);
      const courseContent = await contentModel.getSection('course');

      res.render('dashboard/index', {
        title: 'My Dashboard',
        reviews,
        tickets,
        hotmartUrl: courseContent.hotmart_url || '#',
      });
    } catch (err) {
      next(err);
    }
  },

};

export default dashboardController;
