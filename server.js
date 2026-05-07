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
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_imama',
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
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Password salah' });
    }
});

// Route: Ambil Semua Data (Sinkronisasi Antar Device)
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'events', 'gallery', 'staff'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, rows) => {
            if (!err) {
                if (table === 'settings') {
                    const settingsObj = {};
                    rows.forEach(s => settingsObj[s.s_key] = s.s_value);
                    result[table] = settingsObj;
                } else {
                    result[table] = rows;
                }
            }
            completed++;
            if (completed === tables.length) {
                res.json(result);
            }
        });
    });
});

// Route: Simpan Massal (Sinkronisasi ke Database)
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    const conn = db.promise();
    
    try {
        // 1. Update About
        if (data.about) {
            const aboutText = typeof data.about === 'string' ? data.about : (data.about.intro || '');
            await conn.query('UPDATE about SET content = ? WHERE id = 1', [aboutText]);
        }

        // 2. Update Settings
        if (data.settings) {
            for (const [key, val] of Object.entries(data.settings)) {
                await conn.query('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, val]);
            }
        }

        // 3. Sync Events (News)
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

        // 4. Sync Staff (Officers)
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

        // 5. Sync Gallery
        if (data.gallery) {
            await conn.query('DELETE FROM gallery');
            if (data.gallery.length > 0) {
                const vals = data.gallery.map(img => [typeof img === 'string' ? img : img.image_data, '']);
                await conn.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route Fallback untuk Frontend
app.get('/admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin.html'));
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Penting untuk Vercel
module.exports = app;