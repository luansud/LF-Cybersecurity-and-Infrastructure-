import contentModel from '../models/contentModel.js';
import newsModel from '../models/newsModel.js';
import reviewModel from '../models/reviewModel.js';
// Shows the home page with dynamic content, latest news, and reviews
// Controller for public pages
const homeController = {
  async showHome(req, res, next) {
    try {
      const content = await contentModel.getSection('home');
      const latestNews = await newsModel.getPublished(null, 6);
      const reviews = await reviewModel.getApproved();
      
      res.render('public/home', {
        title: 'LF Cybersecurity and Infrastructure',
        content,
        latestNews,
        reviews: reviews.slice(0, 3),
      });
    } catch (err) {
      next(err);
    }
  },
// Show course page with content and reviews
  async showCourse(req, res, next) {
    try {
      const content = await contentModel.getSection('course');
      const reviews = await reviewModel.getApproved('course');
      res.render('public/course', {
        title: content.page_title || 'Cybersecurity Course',
        content,
        reviews: reviews.slice(0, 5),
      });
    } catch (err) {
      next(err);
    }
  },
//  Show consulting page with content and reviews
  async showConsulting(req, res, next) {
    try {
      const content = await contentModel.getSection('consulting');
      const reviews = await reviewModel.getApproved('consulting');
      res.render('public/consulting', {
        title: content.page_title || 'Consulting Services',
        content,
        reviews: reviews.slice(0, 5),
      });
    } catch (err) {
      next(err);
    }
  },
// Show about page with content
  async showAbout(req, res, next) {
    try {
      const content = await contentModel.getSection('about');

      res.render('public/about', {
        title: 'About',
        content,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default homeController;
