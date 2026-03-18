import newsModel from '../models/newsModel.js';
// Define category labels for display
const CATEGORY_LABELS = {
  cyber_world: 'Cyber Around the World',
  articles: 'My Articles',
  course_news: 'Course News',
};

const newsController = {
  // GET /news
  async index(req, res, next) {
    try {
      const cyberWorld = await newsModel.getPublished('cyber_world', 3);
      const articles = await newsModel.getPublished('articles', 3);
      const courseNews = await newsModel.getPublished('course_news', 3);

      res.render('public/news', {
        title: 'News',
        cyberWorld,
        articles,
        courseNews,
        categoryLabels: CATEGORY_LABELS,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /news/:category
  async byCategory(req, res, next) {
    try {
      const { category } = req.params;
      if (!CATEGORY_LABELS[category]) {
        return res.status(404).render('errors/404', { title: '404 — Page Not Found' });
      }

      const articles = await newsModel.getPublished(category);

      res.render('public/news-category', {
        title: CATEGORY_LABELS[category],
        articles,
        category,
        categoryLabel: CATEGORY_LABELS[category],
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /news/article/:id
  async showArticle(req, res, next) {
    try {
      const article = await newsModel.getById(req.params.id);

      if (!article || !article.is_published) {
        return res.status(404).render('errors/404', { title: '404 — Page Not Found' });
      }

      res.render('public/news-article', {
        title: article.title,
        article,
        categoryLabel: CATEGORY_LABELS[article.category] || article.category,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default newsController;
