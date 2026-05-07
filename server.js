require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Konfigurasi Koneksi Database
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_imama',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test koneksi database
db.getConnection((err, connection) => {
    if (err) console.error('Database connection failed:', err);
    else {
        console.log('MySQL Connected via Pool...');
        connection.release();
    }
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
    db.query('SELECT * FROM settings', (err, results) => {
        if (err) return res.status(500).send(err);
        const settings = {};
        results.forEach(row => settings[row.s_key] = row.s_value);
        res.json(settings);
    });
});

app.post('/api/settings', (req, res) => {
    const settings = req.body;
    const queries = Object.keys(settings).map(key => {
        return new Promise((resolve, reject) => {
            db.query('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, settings[key]], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
    Promise.all(queries)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send(err));
});

// Routes: Hero Slides
app.get('/api/hero', (req, res) => {
    db.query('SELECT * FROM hero_slides ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error("Error fetching hero slides:", err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/api/hero', (req, res) => {
    const { image } = req.body;
    console.log("Received POST /api/hero. Image data length:", image ? image.length : 0);
    db.query('INSERT INTO hero_slides (image_data) VALUES (?)', [image], (err, results) => {
        if (err) { console.error("Error inserting hero slide:", err); return res.status(500).send(err); }
        res.json({ id: results.insertId, image: image ? image.substring(0, 50) + "..." : "No image" }); // Return truncated image for log clarity
    });
});

app.delete('/api/hero/:id', (req, res) => {
    db.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id], (err) => {
        if (err) { console.error("Error deleting hero slide:", err); return res.status(500).send(err); }
        res.json({ success: true });
    });
});

// Routes: Events
app.get('/api/events', (req, res) => {
    db.query('SELECT * FROM events ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results.map(e => ({
            id: e.id,
            title: e.title,
            category: e.category,
            desc: e.description,
            date: e.event_date,
            image: e.image_data
        })));
    });
});

app.post('/api/events', (req, res) => {
    const { title, category, desc, date, image } = req.body;
    db.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES (?, ?, ?, ?, ?)', 
    [title, category, desc, date, image], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, title, desc, date, image });
    });
});

app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// Routes: Gallery
app.get('/api/gallery', (req, res) => {
    db.query('SELECT * FROM gallery ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results.map(g => ({
            id: g.id,
            image: g.image_data,
            caption: g.caption
        })));
    });
});

app.post('/api/gallery', (req, res) => {
    const { image, caption } = req.body;
    db.query('INSERT INTO gallery (image_data, caption) VALUES (?, ?)', 
    [image, caption], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, image, caption });
    });
});

app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM gallery WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// Routes: Staff/Pengurus
app.get('/api/staff', (req, res) => {
    db.query('SELECT * FROM staff ORDER BY id ASC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/staff', (req, res) => {
    const { name, position, department, image } = req.body;
    db.query('INSERT INTO staff (name, position, department, image_data) VALUES (?, ?, ?, ?)', 
    [name, position, department, image], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, name, position, department });
    });
});

app.delete('/api/staff/:id', (req, res) => {
    db.query('DELETE FROM staff WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// Routes: Export All Data
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'hero_slides', 'events', 'gallery', 'staff'];
    const data = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, results) => {
            if (err) return res.status(500).send(err);
            data[table] = results;
            completed++;
            if (completed === tables.length) {
                res.json(data);
            }
        });
    });
});

// Maintenance: Clear Data
app.post('/api/clear-data', (req, res) => {
    const tables = ['events', 'gallery', 'hero_slides', 'staff'];
    const queries = tables.map(t => new Promise((rel, rej) => {
        db.query(`DELETE FROM ${t}`, (err) => err ? rej(err) : rel());
    }));

    Promise.all(queries)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send(err));
});

// Maintenance: Bulk Import
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    
    try {
        // Update About
        if (data.about && data.about.length > 0) {
            db.query('UPDATE about SET content = ? WHERE id = 1', [data.about[0].content || data.about]);
        }

        // Update Settings
        if (data.settings) {
            const settings = Array.isArray(data.settings) ? data.settings : Object.entries(data.settings).map(([k,v]) => ({s_key:k, s_value:v}));
            settings.forEach(s => db.query('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [s.s_key, s.s_value]));
        }

        // Insert Tables
        if (data.events?.length) {
            const vals = data.events.map(e => [e.title, e.category, e.description || e.desc, e.event_date || e.date, e.image_data || e.image]);
            db.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
        }

        if (data.gallery?.length) {
            const vals = data.gallery.map(g => [g.image_data || g.image, g.caption]);
            db.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
        }

        if (data.hero_slides?.length) {
            const vals = data.hero_slides.map(h => [h.image_data || h.image]);
            db.query('INSERT INTO hero_slides (image_data) VALUES ?', [vals]);
        }

        if (data.staff?.length) {
            const vals = data.staff.map(s => [s.name, s.position, s.department, s.image_data || s.image]);
            db.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route Login Admin
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASS || 'imama123';
    if (password === adminPass) {
        res.json({ success: true, message: "Login berhasil" });
    } else {
        res.status(401).json({ success: false, message: "Password salah" });
    }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;