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

// API: Import data secara massal
app.post('/api/bulk-import', (req, res) => {
    const data = req.body;
    // Logika pembersihan dan pengisian ulang tabel database
    // (Sesuaikan dengan kebutuhan bisnis organisasi)
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;