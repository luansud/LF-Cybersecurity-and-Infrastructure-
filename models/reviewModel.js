import pool from '../config/db.js';

const reviewModel = {
  async create({ user_id, content, rating, review_type }) {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, content, rating, review_type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, content, rating, review_type]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async getByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  },

  async getApproved(review_type = null) {
    let query = `SELECT r.*, u.first_name, u.last_name
                 FROM reviews r JOIN users u ON r.user_id = u.id
                 WHERE r.is_approved = true`;
    const params = [];
    if (review_type) {
      query += ' AND r.review_type = $1';
      params.push(review_type);
    }
    query += ' ORDER BY r.created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getAll() {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.email
       FROM reviews r JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  },

  async update(id, { content, rating }) {
    const result = await pool.query(
      `UPDATE reviews SET content = $1, rating = $2, is_approved = false, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [content, rating, id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  async approve(id) {
    const result = await pool.query(
      'UPDATE reviews SET is_approved = true, is_flagged = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  async flag(id) {
    const result = await pool.query(
      'UPDATE reviews SET is_flagged = true, is_approved = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};

export default reviewModel;
