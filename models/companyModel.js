import pool from '../config/db.js';

const companyModel = {
  async create({ user_id, company_name, industry, company_size, phone, website }) {
    const result = await pool.query(
      `INSERT INTO companies (user_id, company_name, industry, company_size, phone, website)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, company_name, industry, company_size, phone, website]
    );
    return result.rows[0];
  },

  async getByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1',
      [user_id]
    );
    return result.rows[0] || null;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT c.*, u.email, u.first_name, u.last_name
       FROM companies c JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id, { company_name, industry, company_size, phone, website }) {
    const result = await pool.query(
      `UPDATE companies SET company_name = $1, industry = $2, company_size = $3, phone = $4, website = $5
       WHERE id = $6 RETURNING *`,
      [company_name, industry, company_size, phone, website, id]
    );
    return result.rows[0] || null;
  },
};

export default companyModel;
