const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Melayani file statis dari root folder
app.use(express.static(process.cwd()));

// Test koneksi database
db.getConnection((err, connection) => {
    if (err) console.error('Database connection failed:', err);
    else {
        console.log('MySQL Connected via Pool...');
        connection.release();
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

// Routes: About
app.get('/api/about', (req, res) => {
    db.query('SELECT content FROM about WHERE id = 1', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]?.content || "Selamat datang di IMAMA UNESA.");
    });
});

app.post('/api/about', (req, res) => {
    const { content } = req.body;
    db.query('UPDATE about SET content = ? WHERE id = 1', [content], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// Routes: Settings (Email, IG, Titles)
app.get('/api/settings', (req, res) => {

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;