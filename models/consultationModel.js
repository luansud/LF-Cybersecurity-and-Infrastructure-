import pool from '../config/db.js';

const consultationModel = {
  async create({ company_id, title, description, priority = 'medium' }) {
    const result = await pool.query(
      `INSERT INTO consultations (company_id, title, description, priority)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [company_id, title, description, priority]
    );
    return result.rows[0];
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT c.*, co.company_name, u.first_name, u.last_name, u.email
       FROM consultations c
       JOIN companies co ON c.company_id = co.id
       JOIN users u ON co.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async getByCompanyId(company_id) {
    const result = await pool.query(
      'SELECT * FROM consultations WHERE company_id = $1 ORDER BY created_at DESC',
      [company_id]
    );
    return result.rows;
  },

  async getAll() {
    const result = await pool.query(
      `SELECT c.*, co.company_name
       FROM consultations c
       JOIN companies co ON c.company_id = co.id
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE consultations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  },

  async addNote({ consultation_id, user_id, note }) {
    const result = await pool.query(
      `INSERT INTO consultation_notes (consultation_id, user_id, note)
       VALUES ($1, $2, $3) RETURNING *`,
      [consultation_id, user_id, note]
    );
    return result.rows[0];
  },

  async getNotes(consultation_id) {
    const result = await pool.query(
      `SELECT cn.*, u.first_name, u.last_name, u.role
       FROM consultation_notes cn
       LEFT JOIN users u ON cn.user_id = u.id
       WHERE cn.consultation_id = $1
       ORDER BY cn.created_at ASC`,
      [consultation_id]
    );
    return result.rows;
  },

  async getCountByStatus() {
    const result = await pool.query(
      'SELECT status, COUNT(*) as count FROM consultations GROUP BY status'
    );
    return result.rows;
  },
};

export default consultationModel;
