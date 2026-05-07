const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_imama',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const PORT = process.env.PORT || 3000;

async function queryRows(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASS || 'imama123';
  if (password === adminPass) {
    return res.json({ success: true, message: 'Login berhasil' });
  }
  res.status(401).json({ success: false, message: 'Password salah' });
});

app.get('/api/about', async (req, res) => {
  try {
    const rows = await queryRows('SELECT * FROM about LIMIT 1');
    res.json(rows[0] || { intro: '', history: '', logo: '', philosophy: '', vision: '' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/about', async (req, res) => {
  try {
    const { intro, history, logo, philosophy, vision } = req.body;
    await queryRows(
      'INSERT INTO about (id, intro, content, history, logo, philosophy, vision) VALUES (1, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE intro = VALUES(intro), content = VALUES(content), history = VALUES(history), logo = VALUES(logo), philosophy = VALUES(philosophy), vision = VALUES(vision)',
      [intro || '', intro || '', history || '', logo || '', philosophy || '', vision || '']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const rows = await queryRows('SELECT s_key, s_value FROM settings');
    const settings = {};
    rows.forEach(row => { settings[row.s_key] = row.s_value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const keys = Object.entries(req.body);
    for (const [key, value] of keys) {
      await queryRows('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, value]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/hero', async (req, res) => {
  try {
    const rows = await queryRows('SELECT id, image_data FROM hero_slides ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/hero', async (req, res) => {
  try {
    const { image } = req.body;
    await queryRows('INSERT INTO hero_slides (image_data) VALUES (?)', [image]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const rows = await queryRows('SELECT * FROM events ORDER BY event_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, category, description, event_date, image_data } = req.body;
    await queryRows('INSERT INTO events (title, category, description, event_date, image_data) VALUES (?, ?, ?, ?, ?)', [title, category, description, event_date, image_data]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await queryRows('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const rows = await queryRows('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { image_data, caption } = req.body;
    await queryRows('INSERT INTO gallery (image_data, caption) VALUES (?, ?)', [image_data, caption]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await queryRows('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/staff', async (req, res) => {
  try {
    const rows = await queryRows('SELECT * FROM staff ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const { name, position, department, major, batch, image_data } = req.body;
    await queryRows('INSERT INTO staff (name, position, department, major, batch, image_data) VALUES (?, ?, ?, ?, ?, ?)', [name, position, department, major, batch, image_data]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await queryRows('DELETE FROM staff WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/timeline', async (req, res) => {
  try {
    const rows = await queryRows('SELECT * FROM timeline ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/timeline', async (req, res) => {
  try {
    const { year, event } = req.body;
    await queryRows('INSERT INTO timeline (year, event) VALUES (?, ?)', [year, event]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/export-all', async (req, res) => {
  try {
    const aboutRows = await queryRows('SELECT * FROM about LIMIT 1');
    const settings = await queryRows('SELECT s_key, s_value FROM settings');
    const hero_slides = await queryRows('SELECT * FROM hero_slides ORDER BY created_at DESC');
    const events = await queryRows('SELECT * FROM events ORDER BY event_date DESC');
    const gallery = await queryRows('SELECT * FROM gallery ORDER BY created_at DESC');
    const staff = await queryRows('SELECT * FROM staff ORDER BY name ASC');
    const timeline = await queryRows('SELECT * FROM timeline ORDER BY created_at DESC');
    const settingsObj = {};
    settings.forEach(row => { settingsObj[row.s_key] = row.s_value; });
    res.json({ about: aboutRows[0] || { intro: '', history: '', logo: '', philosophy: '', vision: '' }, settings: settingsObj, hero_slides, events, gallery, staff, timeline });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bulk-import', async (req, res) => {
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
    res.json({ success: true });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
