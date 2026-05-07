const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- Konfigurasi Koneksi Database ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Melayani file statis
app.use(express.static(process.cwd()));

// --- API Routes ---

// Route: Login Admin
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASS || 'imama123';
    if (password === adminPass) {
        res.json({ success: true, message: "Login berhasil" });
    } else {
        res.status(401).json({ success: false, message: "Password salah" });
    }
});

// Route: Get About
app.get('/api/about', (req, res) => {
    db.query('SELECT content FROM about WHERE id = 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Route: Get Settings
app.get('/api/settings', (req, res) => {
    db.query('SELECT s_key, s_value FROM settings', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const settings = {};
        results.forEach(row => settings[row.s_key] = row.s_value);
        res.json(settings);
    });
});

// Route: Get All Data (Export)
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'events', 'gallery', 'staff', 'timeline'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, rows) => {
            if (!err) result[table] = rows;
            completed++;
            if (completed === tables.length) {
                if (result.settings) {
                    const settingsObj = {};
                    result.settings.forEach(s => settingsObj[s.s_key] = s.s_value);
                    result.settings = settingsObj;
                }
                res.json(result);
            }
        });
    });
});

// Route: Bulk Import (Update Database)
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    const connection = await db.promise().getConnection(); // Gunakan promise-based connection
    try {
        await connection.beginTransaction(); // Mulai transaksi

        if (data.about) {
            const aboutContent = typeof data.about === 'string' ? data.about : (data.about.intro || data.about[0]?.content || '');
            await connection.execute('UPDATE about SET content = ? WHERE id = 1', [aboutContent]);
        }

        if (data.settings) {
            for (const key in data.settings) {
                await connection.execute('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, data.settings[key]]);
            }
        }

        if (data.events || data.news) {
            const events = data.events || data.news;
            await connection.execute('DELETE FROM events');
            if (events.length > 0) {
                const vals = events.map(e => [e.title, e.category || 'Umum', e.desc || e.description || '', e.date || e.event_date || null, e.image || e.image_data || null]);
                await connection.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
            }
        }

        if (data.officers || data.staff) {
            const staff = data.officers || data.staff;
            await connection.execute('DELETE FROM staff');
            if (staff.length > 0) {
                const vals = staff.map(s => [s.name, s.role || s.position || '', s.dept || s.department || 'BPH', s.image || s.image_data || null]);
                await connection.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
            }
        }

        if (data.gallery) {
            await connection.execute('DELETE FROM gallery');
            if (data.gallery.length > 0) {
                const vals = data.gallery.map(img => [typeof img === 'string' ? img : (img.image_data || img), '']);
                await connection.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
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

// Route navigasi ke HTML
app.get('/admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;