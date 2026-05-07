const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function queryRows(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database environment variables not configured. Please set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Vercel.' 
      });
    }

    const aboutRows = await queryRows('SELECT * FROM about LIMIT 1');
    const settings = await queryRows('SELECT s_key, s_value FROM settings');
    const hero_slides = await queryRows('SELECT * FROM hero_slides ORDER BY created_at DESC');
    const events = await queryRows('SELECT * FROM events ORDER BY event_date DESC');
    const gallery = await queryRows('SELECT * FROM gallery ORDER BY created_at DESC');
    const staff = await queryRows('SELECT * FROM staff ORDER BY name ASC');
    const timeline = await queryRows('SELECT * FROM timeline ORDER BY created_at DESC');
    const settingsObj = {};
    settings.forEach(row => { settingsObj[row.s_key] = row.s_value; });
    res.status(200).json({ about: aboutRows[0] || { intro: '', history: '', logo: '', philosophy: '', vision: '' }, settings: settingsObj, hero_slides, events, gallery, staff, timeline });
  } catch (err) {
    console.error('[export-all error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};