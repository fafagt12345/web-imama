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
const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // Memuat variabel lingkungan dari .env

const app = express();
app.use(cors()); // Mengizinkan CORS untuk komunikasi frontend-backend
app.use(express.json({ limit: '50mb' })); // Mengizinkan body JSON, dengan limit besar untuk Base64

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

// --- Test Koneksi Database (hanya untuk development lokal) ---
if (process.env.NODE_ENV !== 'production') {
    db.getConnection((err, connection) => {
        if (err) console.error('Database connection failed:', err);
        else {
            console.log('MySQL Connected via Pool...');
            connection.release(); // Lepaskan koneksi setelah tes
        }
    });
}

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

// Routes: About
app.get('/api/about', (req, res) => {
    db.query('SELECT content FROM about WHERE id = 1', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results[0] || { content: '' });
    });
});
app.post('/api/about', (req, res) => {
    const { content } = req.body;
    db.query('UPDATE about SET content = ? WHERE id = 1', [content], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// Routes: Settings (Hero & Contact)
app.get('/api/settings', (req, res) => {
    db.query('SELECT s_key, s_value FROM settings', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        const settings = {};
        results.forEach(row => settings[row.s_key] = row.s_value);
        res.json(settings);
    });
});
app.post('/api/settings', (req, res) => {
    const settings = req.body;
    const queries = Object.entries(settings).map(([key, value]) => {
        return new Promise((resolve, reject) => {
            db.query('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, value], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
    Promise.all(queries)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Routes: Hero Slides (Contoh, jika ada tabel terpisah)
app.get('/api/hero', (req, res) => {
    db.query('SELECT id, image_data FROM hero_slides ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});
app.post('/api/hero', (req, res) => {
    const { image } = req.body;
    db.query('INSERT INTO hero_slides (image_data) VALUES (?)', [image], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
app.delete('/api/hero/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM hero_slides WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// Routes: Events
app.get('/api/events', (req, res) => {
    db.query('SELECT * FROM events ORDER BY event_date DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});
app.post('/api/events', (req, res) => {
    const { title, category, desc, date, image } = req.body;
    db.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES (?, ?, ?, ?, ?)', [title, category, desc, date, image], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// Routes: Gallery
app.get('/api/gallery', (req, res) => {
    db.query('SELECT * FROM gallery ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});
app.post('/api/gallery', (req, res) => {
    const { image, caption } = req.body;
    db.query('INSERT INTO gallery (image_data, caption) VALUES (?, ?)', [image, caption], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM gallery WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// Routes: Staff
app.get('/api/staff', (req, res) => {
    db.query('SELECT * FROM staff ORDER BY name ASC', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});
app.post('/api/staff', (req, res) => {
    const { name, position, department, image } = req.body;
    db.query('INSERT INTO staff (name, position, department, image_data) VALUES (?, ?, ?, ?)', [name, position, department, image], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
app.delete('/api/staff/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM staff WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// Routes: Export All Data (untuk sinkronisasi)
app.get('/api/export-all', (req, res) => {
    const tables = ['about', 'settings', 'hero_slides', 'events', 'gallery', 'staff'];
    const result = {};
    let completed = 0;

    tables.forEach(table => {
        db.query(`SELECT * FROM ${table}`, (err, rows) => {
            if (err) {
                console.error(`Error fetching ${table}:`, err);
                result[table] = []; // Tetap kirim array kosong jika error
            } else {
                result[table] = rows;
            }
            completed++;
            if (completed === tables.length) {
                // Khusus untuk settings, ubah format dari array ke objek
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

// Routes: Bulk Import Data (untuk sinkronisasi)
app.post('/api/bulk-import', async (req, res) => {
    const data = req.body;
    const connection = await db.promise().getConnection(); // Gunakan promise-based connection
    try {
        await connection.beginTransaction(); // Mulai transaksi

        // 1. Update About
        if (data.about) {
            const aboutContent = typeof data.about === 'string' ? data.about : (data.about.intro || data.about[0]?.content || '');
            await connection.execute('UPDATE about SET content = ? WHERE id = 1', [aboutContent]);
        }

        // 2. Update Settings (Hero & Contact)
        if (data.settings) {
            const settingsToInsert = [];
            // Map dari format objek ke array [key, value]
            for (const key in data.settings) {
                settingsToInsert.push([key, data.settings[key]]);
            }
            // Jika ada data hero/contact dari frontend, tambahkan
            if (data.hero) {
                settingsToInsert.push(['hero_title', data.hero.title || '']);
                settingsToInsert.push(['hero_subtitle', data.hero.subtitle || '']);
            }
            if (data.contact) {
                settingsToInsert.push(['email', data.contact.email || '']);
                settingsToInsert.push(['instagram', data.contact.instagram || '']);
            }

            for (const [key, value] of settingsToInsert) {
                await connection.execute('REPLACE INTO settings (s_key, s_value) VALUES (?, ?)', [key, value]);
            }
        }

        // 3. Sync Events (news)
        if (data.news || data.events) {
            const events = data.news || data.events;
            await connection.execute('DELETE FROM events');
            if (events.length > 0) {
                const vals = events.map(e => [e.title, e.category || 'Umum', e.desc || e.description || '', e.date || e.event_date || null, e.image || e.image_data || null]);
                await connection.query('INSERT INTO events (title, category, description, event_date, image_data) VALUES ?', [vals]);
            }
        }

        // 4. Sync Staff (officers)
        if (data.officers || data.staff) {
            const staff = data.officers || data.staff;
            await connection.execute('DELETE FROM staff');
            if (staff.length > 0) {
                const vals = staff.map(s => [s.name, s.role || s.position || '', s.dept || s.department || 'BPH', s.image || s.image_data || null]);
                await connection.query('INSERT INTO staff (name, position, department, image_data) VALUES ?', [vals]);
            }
        }

        // 5. Sync Gallery
        if (data.gallery) {
            await connection.execute('DELETE FROM gallery');
            if (data.gallery.length > 0) {
                const vals = data.gallery.map(img => [typeof img === 'string' ? img : img.image_data, '']);
                await connection.query('INSERT INTO gallery (image_data, caption) VALUES ?', [vals]);
            }
        }

        // 6. Sync Hero Slides (jika ada data hero.slides)
        if (data.hero_slides) {
            await connection.execute('DELETE FROM hero_slides');
            if (data.hero_slides.length > 0) {
                const vals = data.hero_slides.map(slide => [slide.image_data || slide.image]);
                await connection.query('INSERT INTO hero_slides (image_data) VALUES ?', [vals]);
            }
        }

        // 7. Sync Timeline (jika ada data timeline)
        if (data.timeline) {
            await connection.execute('DELETE FROM timeline'); // Asumsi ada tabel timeline
            if (data.timeline.length > 0) {
                const vals = data.timeline.map(t => [t.year, t.event]);
                await connection.query('INSERT INTO timeline (year, event) VALUES ?', [vals]);
            }
        }

        await connection.commit(); // Commit transaksi
        res.json({ success: true, message: "Data berhasil disinkronkan ke Cloud" });
    } catch (err) {
        await connection.rollback(); // Rollback jika ada error
        console.error("Error during bulk import:", err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release(); // Selalu lepaskan koneksi
    }
});

// Routes: Clear All Data
app.post('/api/clear-data', async (req, res) => {
    const tables = ['events', 'gallery', 'hero_slides', 'staff', 'timeline']; // Tambahkan tabel lain jika perlu
    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();
        for (const table of tables) {
            await connection.execute(`DELETE FROM ${table}`);
        }
        await connection.commit();
        res.json({ success: true, message: "Semua data konten berhasil dihapus." });
    } catch (err) {
        await connection.rollback();
        console.error("Error clearing data:", err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release();
    }
});

// --- Server Listener (untuk development lokal) ---
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// --- Export aplikasi Express untuk Vercel ---
module.exports = app;

module.exports = app;