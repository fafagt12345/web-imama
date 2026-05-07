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
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Password salah" });
    }
});

// Route: Ambil Semua Data
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'events', 'gallery', 'staff', 'timeline'];
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

// Route: Simpan Data Massal
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    const conn = db.promise();
    try {
        if (data.about) await conn.query('UPDATE about SET content = ? WHERE id = 1', [data.about.intro || data.about]);
        
        if (data.events || data.news) {
            const items = data.events || data.news;
            await conn.query('DELETE FROM events');
            if (items.length > 0) {
                const vals = items.map(e => [e.title, e.category, e.desc || e.description, e.date || e.event_date, e.image || e.image_data]);
                await conn.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
            }
        }
        
        if (data.staff || data.officers) {
            const items = data.staff || data.officers;
            await conn.query('DELETE FROM staff');
            if (items.length > 0) {
                const vals = items.map(s => [s.name, s.role || s.position, s.dept || s.department, s.image || s.image_data]);
                await conn.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;