# Website IMAMA UNESA

Website profil Ikatan Mahasiswa Manajemen Akuntansi UNESA dengan sistem manajemen konten mandiri.

## Prasyarat
- Node.js terinstal
- MySQL (XAMPP/Laragon)

## Struktur File
- `index.html`: Halaman utama untuk publik.
- `admin.html`: Panel kendali konten (Password default: `imama123`).
- `style.css`: File desain global.
- `script.js`: Logika penampil data.
- `admin.js`: Logika manajemen data dan login.
- `server.js`: Backend Node.js untuk MySQL.
- `database.sql`: Struktur database MySQL.

## Sistem Database
Website ini sekarang menggunakan **MySQL**.

### Cara Menjalankan:
1. Import `database.sql` ke MySQL Anda.
2. Jalankan `npm install express mysql2 cors dotenv` di terminal.
3. Jalankan server dengan perintah `node server.js`.
4. Buka `http://localhost:3000` di browser.

> `admin.html` menyimpan data ke server, dan `index.html` memuat data langsung dari server agar perubahan dapat dilihat pada perangkat lain.

### Deployment
Untuk menjalankan di server produksi:
1. Pastikan variabel lingkungan (`.env`) sudah terisi:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `ADMIN_PASS` (untuk keamanan, pindahkan PASS dari `admin.js` ke `.env`)
2. Gunakan port dinamis: `const PORT = process.env.PORT || 3000;`.
3. Gunakan process manager seperti **PM2**: `pm2 start server.js`.
4. Pastikan folder publik di-serve melalui `express.static`.