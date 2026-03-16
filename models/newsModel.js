import pool from '../config/db.js';

const newsModel = {
  async create({ title, summary, content, category, image_url, author_id }) {
    const result = await pool.query(
      `INSERT INTO news_articles (title, summary, content, category, image_url, is_published, author_id)
       VALUES ($1, $2, $3, $4, $5, false, $6) RETURNING *`,
      [title, summary, content, category, image_url, author_id]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT n.*, u.first_name, u.last_name
       FROM news_articles n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE n.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async getPublished(category = null, limit = null) {
    let query = `SELECT n.*, u.first_name, u.last_name
                 FROM news_articles n
                 LEFT JOIN users u ON n.author_id = u.id
                 WHERE n.is_published = true`;
    const params = [];
    if (category) {
      params.push(category);
      query += ` AND n.category = $${params.length}`;
    }
    query += ' ORDER BY n.created_at DESC';
    if (limit) {
      params.push(limit);
      query += ` LIMIT $${params.length}`;
    }
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getAll() {
    const result = await pool.query(
      `SELECT n.*, u.first_name, u.last_name
       FROM news_articles n
       LEFT JOIN users u ON n.author_id = u.id
       ORDER BY n.created_at DESC`
    );
    return result.rows;
  },

  async update(id, { title, summary, content, category, image_url }) {
    const result = await pool.query(
      `UPDATE news_articles
       SET title = $1, summary = $2, content = $3, category = $4, image_url = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [title, summary, content, category, image_url, id]
    );
    return result.rows[0] || null;
  },

  async togglePublished(id) {
    const result = await pool.query(
      'UPDATE news_articles SET is_published = NOT is_published, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM news_articles WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};

export default newsModel;
