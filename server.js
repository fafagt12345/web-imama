const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Konfigurasi Koneksi Database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Melayani file statis dari root folder
app.use(express.static(process.cwd()));

// Test koneksi database
if (process.env.NODE_ENV !== 'production') {
    db.getConnection((err, connection) => {
        if (err) console.error('Database connection failed:', err);
        else {
            console.log('MySQL Connected via Pool...');
            connection.release();
        }
    });
}

// Route Login Admin
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASS || 'imama123')) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Password salah' });
    }
});

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Route untuk halaman admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin.html'));
});

// API: Ambil semua data untuk sinkronisasi
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'hero_slides', 'events', 'gallery', 'staff'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, rows) => {
            if (!err) result[table] = rows;
            completed++;
            if (completed === tables.length) res.json(result);
        });
    });
});

// API: Import data secara massal (Sinkronisasi ke MySQL)
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    
    try {
        // 1. Update About
        if (data.about) {
            const aboutText = typeof data.about === 'string' ? data.about : (data.about.intro || '');
            db.query('UPDATE about SET content = ? WHERE id = 1', [aboutText]);
        }

        // 2. Update Settings (Hero & Contact)
        if (data.contact) {
            const settings = [
                ['email', data.contact.email],
                ['instagram', data.contact.instagram],
                ['hero_title', data.hero?.title || ''],
                ['hero_subtitle', data.hero?.subtitle || '']
            ];
            settings.forEach(([key, val]) => {
                db.query('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, val]);
            });
        }

        // 3. Update Events (Hapus lama, masukkan baru)
        if (data.events && data.events.length > 0) {
            db.query('DELETE FROM events', () => {
                const vals = data.events.map(e => [e.title, e.category || 'Umum', e.desc || '', e.date || null, e.image || null]);
                db.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
            });
        }

        // 4. Update Staff
        if (data.staff && data.staff.length > 0) {
            db.query('DELETE FROM staff', () => {
                const vals = data.staff.map(s => [s.name, s.role || '', s.dept || 'BPH', s.image || null]);
                db.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
            });
        }

        // 5. Update Gallery
        if (data.gallery && data.gallery.length > 0) {
            db.query('DELETE FROM gallery', () => {
                const vals = data.gallery.map(img => [img, '']);
                db.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
            });
        }

        res.json({ success: true, message: "Data berhasil disinkronkan ke Cloud" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;