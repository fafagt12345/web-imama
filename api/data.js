import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    };

    if (req.method === 'GET') {
        let connection = null;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT content FROM site_settings WHERE id = 1');
            if (rows.length > 0) {
                return res.status(200).json(JSON.parse(rows[0].content));
            }
            return res.status(200).json(null); 
        } catch (error) {
            console.error('Database Error:', error);
            return res.status(500).json({ error: "Gagal koneksi database. Pastikan DB_HOST bukan 127.0.0.1 di Vercel." });
        } finally {
            if (connection) await connection.end();
        }
    }

    if (req.method === 'POST') {
        let connection = null;
        try {
            const { password, data, action } = req.body;
            const adminPass = process.env.ADMIN_PASS || 'imama123';

            if (password !== adminPass) {
                return res.status(401).json({ success: false, message: "Password salah!" });
            }

            if (action === 'login') {
                return res.status(200).json({ success: true });
            }

            connection = await mysql.createConnection(dbConfig);
            const content = JSON.stringify(data);
            await connection.execute(
                'INSERT INTO site_settings (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = ?',
                [content, content]
            );
            
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Database simpan error: " + error.message });
        } finally {
            if (connection) await connection.end();
        }
    }
}
