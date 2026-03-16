import pool from '../config/db.js';

const contentModel = {
  async get(section, content_key) {
    const result = await pool.query(
      'SELECT content_value FROM site_content WHERE section = $1 AND content_key = $2',
      [section, content_key]
    );
    return result.rows[0]?.content_value || '';
  },

  async getSection(section) {
    const result = await pool.query(
      'SELECT content_key, content_value FROM site_content WHERE section = $1',
      [section]
    );
    // Return as key-value object
    const content = {};
    result.rows.forEach(row => {
      content[row.content_key] = row.content_value;
    });
    return content;
  },

  async upsert(section, content_key, content_value, updated_by) {
    const result = await pool.query(
      `INSERT INTO site_content (section, content_key, content_value, updated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (section, content_key)
       DO UPDATE SET content_value = $3, updated_by = $4, updated_at = NOW()
       RETURNING *`,
      [section, content_key, content_value, updated_by]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      'SELECT * FROM site_content ORDER BY section, content_key'
    );
    return result.rows;
  },
};

export default contentModel;
