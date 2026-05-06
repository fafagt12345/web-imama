const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname)); // Melayani file statis (html, css, js)

// Konfigurasi Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Kosongkan jika menggunakan XAMPP default
    database: 'db_imama'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

// Maintenance: Clear Data
app.post('/api/clear-data', (req, res) => {
    db.query('DELETE FROM events', (err) => {
        if (err) return res.status(500).send(err);
        db.query('DELETE FROM gallery', (err) => {
            if (err) return res.status(500).send(err);
            res.json({ success: true });
        });
    });
});

// Maintenance: Bulk Import
app.post('/api/bulk-import', (req, res) => {
    const { about, events, gallery } = req.body;
    if(about) db.query('UPDATE about SET content = ? WHERE id = 1', [about]);
    
    if(events && events.length > 0) {
        const eventValues = events.map(e => [e.title, e.category || 'Umum', e.desc, e.date, e.image]);
        db.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [eventValues]);
    }

    if(gallery && gallery.length > 0) {
        const galleryValues = gallery.map(g => [g.image, g.caption]);
        db.query('INSERT INTO gallery (image_data, caption) VALUES ?', [galleryValues]);
    }
    res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});