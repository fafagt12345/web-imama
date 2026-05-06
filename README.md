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
2. Jalankan `npm install express mysql2 cors body-parser` di terminal.
3. Jalankan server dengan perintah `node server.js`.
4. Buka `index.html` di browser.

**Catatan:** Untuk mengganti password admin, ubah variabel `PASS` di `admin.js`.