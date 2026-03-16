import pool from '../config/db.js';

const ticketModel = {
  async create({ user_id, subject, message, category, priority = 'medium' }) {
    const result = await pool.query(
      `INSERT INTO tickets (user_id, subject, message, category, priority)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, subject, message, category, priority]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.email, u.role
       FROM tickets t JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async getByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  },

  async getAll() {
    const result = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.email
       FROM tickets t JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  },

  async addResponse({ ticket_id, user_id, message }) {
    const result = await pool.query(
      `INSERT INTO ticket_responses (ticket_id, user_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [ticket_id, user_id, message]
    );
    return result.rows[0];
  },

  async getResponses(ticket_id) {
    const result = await pool.query(
      `SELECT tr.*, u.first_name, u.last_name, u.role
       FROM ticket_responses tr
       LEFT JOIN users u ON tr.user_id = u.id
       WHERE tr.ticket_id = $1
       ORDER BY tr.created_at ASC`,
      [ticket_id]
    );
    return result.rows;
  },

  async getCountByStatus() {
    const result = await pool.query(
      'SELECT status, COUNT(*) as count FROM tickets GROUP BY status'
    );
    return result.rows;
  },
};

export default ticketModel;
