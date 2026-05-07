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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const payload = req.body;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      if (payload.about) {
        await connection.execute(
          'INSERT INTO about (id, intro, content, history, logo, philosophy, vision) VALUES (1, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE intro = VALUES(intro), content = VALUES(content), history = VALUES(history), logo = VALUES(logo), philosophy = VALUES(philosophy), vision = VALUES(vision)',
          [payload.about.intro || payload.about || '', payload.about.intro || payload.about || '', payload.about.history || '', payload.about.logo || '', payload.about.philosophy || '', payload.about.vision || '']
        );
      }

      const settings = { ...(payload.settings || {}) };
      if (payload.hero) {
        settings.hero_title = payload.hero.title || '';
        settings.hero_subtitle = payload.hero.subtitle || '';
      }
      if (payload.contact) {
        settings.email = payload.contact.email || '';
        settings.instagram = payload.contact.instagram || '';
        settings.whatsapp = payload.contact.whatsapp || '';
        settings.address = payload.contact.address || '';
      }
      for (const [key, value] of Object.entries(settings)) {
        await connection.execute('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, value]);
      }

      if (Array.isArray(payload.events)) {
        await connection.execute('DELETE FROM events');
        for (const event of payload.events) {
          await connection.execute('INSERT INTO events (title, category, description, event_date, image_data) VALUES (?, ?, ?, ?, ?)', [event.title || '', event.category || '', event.description || event.desc || '', event.event_date || null, event.image_data || '']);
        }
      }

      if (Array.isArray(payload.staff)) {
        await connection.execute('DELETE FROM staff');
        for (const staff of payload.staff) {
          await connection.execute('INSERT INTO staff (name, position, department, major, batch, image_data) VALUES (?, ?, ?, ?, ?, ?)', [staff.name || '', staff.position || '', staff.department || '', staff.major || '', staff.batch || '', staff.image_data || '']);
        }
      }

      if (Array.isArray(payload.gallery)) {
        await connection.execute('DELETE FROM gallery');
        for (const item of payload.gallery) {
          await connection.execute('INSERT INTO gallery (image_data, caption) VALUES (?, ?)', [item.image_data || item.image || '', item.caption || '']);
        }
      }

      if (Array.isArray(payload.timeline)) {
        await connection.execute('DELETE FROM timeline');
        for (const item of payload.timeline) {
          await connection.execute('INSERT INTO timeline (year, event) VALUES (?, ?)', [item.year || '', item.event || '']);
        }
      }

      await connection.commit();
      res.status(200).json({ success: true });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('[bulk-import error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};