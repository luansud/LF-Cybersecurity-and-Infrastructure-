import reviewModel from '../models/reviewModel.js';

const reviewController = {
  // GET /reviews/my
  async myReviews(req, res, next) {
    try {
      const reviews = await reviewModel.getByUserId(req.session.user.id);
      res.render('dashboard/reviews', { title: 'My Reviews', reviews });
    } catch (err) {
      next(err);
    }
  },

  // GET /reviews/new
  showNewReview(req, res) {
    res.render('dashboard/review-form', { title: 'Write a Review', review: null });
  },

  // POST /reviews
  async create(req, res, next) {
    try {
      const { content, rating, review_type } = req.body;
      await reviewModel.create({
        user_id: req.session.user.id,
        content,
        rating: parseInt(rating),
        review_type,
      });
      req.flash('success', 'Review submitted! It will appear publicly after approval.');
      res.redirect('/reviews/my');
    } catch (err) {
      next(err);
    }
  },

  // GET /reviews/:id/edit
  async showEdit(req, res, next) {
    try {
      const review = await reviewModel.getById(req.params.id);
      if (!review || review.user_id !== req.session.user.id) {
        req.flash('error', 'Review not found.');
        return res.redirect('/reviews/my');
      }
      res.render('dashboard/review-form', { title: 'Edit Review', review });
    } catch (err) {
      next(err);
    }
  },

  // POST /reviews/:id
  async update(req, res, next) {
    try {
      const review = await reviewModel.getById(req.params.id);
      if (!review || review.user_id !== req.session.user.id) {
        req.flash('error', 'Review not found.');
        return res.redirect('/reviews/my');
      }

      const { content, rating } = req.body;
      await reviewModel.update(req.params.id, {
        content,
        rating: parseInt(rating),
      });

      req.flash('success', 'Review updated. It will need to be re-approved.');
      res.redirect('/reviews/my');
    } catch (err) {
      next(err);
    }
  },

  // POST /reviews/:id/delete
  async delete(req, res, next) {
    try {
      const review = await reviewModel.getById(req.params.id);
      if (!review || review.user_id !== req.session.user.id) {
        req.flash('error', 'Review not found.');
        return res.redirect('/reviews/my');
      }

      await reviewModel.delete(req.params.id);
      req.flash('success', 'Review deleted.');
      res.redirect('/reviews/my');
    } catch (err) {
      next(err);
    }
  },
};

export default reviewController;
