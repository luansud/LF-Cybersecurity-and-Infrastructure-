import pool from '../config/db.js';
// User model for authentication and user management
const userModel = {
// Get user by email for authentication
  async getByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },
// Get user by ID without password hash for security reasons
   async getById(id) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, phone, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

//  User registration
  async create({ email, password_hash, first_name, last_name, phone, role = 'user' }) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, password_hash, first_name, last_name, phone, role]
    );
    return result.rows[0];
  },

 // Admin can view all users
  async getAll() {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

// Admin can change user roles
  async updateRole(id, role) {
    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [role, id]
    );
    return result.rows[0] || null;
  },

  // Admin can activate/deactivate user accounts
  async toggleActive(id) {
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

 // User profile update
  async updateProfile(id, { first_name, last_name, email, phone }) {
    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_at = NOW()
       WHERE id = $5 RETURNING id, email, first_name, last_name, role, phone`,
      [first_name, last_name, email, phone || null, id]
    );
    return result.rows[0] || null;
  },

  // User password update
  async updatePassword(id, password_hash) {
    const result = await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [password_hash, id]
    );
    return result.rows[0] || null;
  },

  // User notification preferences (stub for now)
  async updateNotificationPrefs(id, prefs) {
    return prefs;
  },

  // Delete user account permanently
  
  async deleteAccount(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  },

// Admin dashboard stats
  async getCountByRole() {
    const result = await pool.query(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );
    return result.rows;
  },
};

export default userModel;
