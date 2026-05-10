import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false } // Penting untuk koneksi ke layanan cloud seperti Railway/PlanetScale
    });

    if (req.method === 'GET') {
        try {
            const [rows] = await db.execute('SELECT content FROM site_settings WHERE id = 1');
            if (rows.length > 0) {
                return res.status(200).json(JSON.parse(rows[0].content));
            }
            // Jika kosong, kembalikan objek kosong agar frontend pakai defaultData
            return res.status(200).json(null);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        } finally {
            await db.end();
        }
    }

    if (req.method === 'POST') {
        const { password, data, action } = req.body;

        // Validasi Password Simple
        if (password !== process.env.ADMIN_PASS) {
            return res.status(401).json({ success: false, message: "Password salah!" });
        }

        if (action === 'login') {
            return res.status(200).json({ success: true });
        }

        try {
            const content = JSON.stringify(data);
            await db.execute(
                'INSERT INTO site_settings (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = ?',
                [content, content]
            );
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        } finally {
            await db.end();
        }
    }
}