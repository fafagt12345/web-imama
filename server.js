const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Melayani file statis dari root folder
app.use(express.static(process.cwd()));

// --- Konfigurasi Koneksi Database MySQL ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Batasi jumlah koneksi
    queueLimit: 0
});

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

// Route: Ambil Semua Data (Sinkronisasi Antar Device)
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'events', 'gallery', 'staff', 'timeline'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, rows) => {
            if (!err) result[table] = rows;
            completed++;
            if (completed === tables.length) {
                // Format settings dari array ke object
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

// Route: Simpan Massal (Update Database dari Admin)
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    const conn = db.promise();
    
    try {
        // 1. Update About
        if (data.about) {
            const aboutText = typeof data.about === 'string' ? data.about : (data.about.intro || '');
            await conn.query('UPDATE about SET content = ? WHERE id = 1', [aboutText]);
        }

        // 2. Sync Events (mapping dari data.news)
        if (data.events || data.news) {
            const events = data.events || data.news;
            await conn.query('DELETE FROM events');
            if (events.length > 0) {
                const vals = events.map(e => [
                    e.title, 
                    e.category || 'Umum', 
                    e.desc || e.description || '', 
                    e.date || e.event_date || null, 
                    e.image || e.image_data || null
                ]);
                await conn.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
            }
        }

        // 3. Sync Staff (mapping dari data.officers)
        if (data.staff || data.officers) {
            const staff = data.staff || data.officers;
            await conn.query('DELETE FROM staff');
            if (staff.length > 0) {
                const vals = staff.map(s => [
                    s.name, 
                    s.role || s.position || '', 
                    s.dept || s.department || 'BPH', 
                    s.image || s.image_data || null
                ]);
                await conn.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
            }
        }

        // 4. Sync Gallery
        if (data.gallery) {
            await conn.query('DELETE FROM gallery');
            if (data.gallery.length > 0) {
                const vals = data.gallery.map(img => [typeof img === 'string' ? img : (img.image_data || img), '']);
                await conn.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Bulk Import Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route fallback untuk melayani HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;