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

## Development (Lokal)

### Cara Menjalankan:
1. Import `database.sql` ke MySQL lokal Anda (XAMPP/Laragon).
2. Jalankan `npm install express mysql2 cors dotenv` di terminal.
3. Update `.env` dengan kredensial MySQL lokal Anda (sudah ada default untuk localhost).
4. Jalankan server dengan perintah `node server.js`.
5. Buka `http://localhost:3000` di browser.

> `admin.html` menyimpan data ke server, dan `index.html` memuat data langsung dari server agar perubahan dapat dilihat pada perangkat lain.

## Deployment ke Vercel (Produksi)

### Langkah-langkah:

1. **Setup Database Eksternal** (pilih salah satu):
   - **PlanetScale** (MySQL): https://planetscale.com (gratis)
   - **Railway**: https://railway.app (gratis)
   - **Supabase**: https://supabase.com
   
   Setelah buat database:
   - Buat database baru bernama `db_imama`
   - Connect ke SQL editor dan jalankan file `database.sql` untuk import struktur

2. **Deploy ke Vercel**:
   - Push repo ke GitHub
   - Login ke Vercel → Add New Project → Connect GitHub repository
   - Di Project Settings → Environment Variables, tambahkan:
     ```
     DB_HOST     = (host database Anda, misal: mysql.planetscale.com)
     DB_USER     = (username database)
     DB_PASSWORD = (password database)
     DB_NAME     = db_imama
     ADMIN_PASS  = imama123  (atau password pilihan Anda)
     ```
   - Deploy → Tunggu selesai (2-3 menit)

3. **Test Deployment**:
   - Kunjungi `https://your-vercel-url.vercel.app/`
   - Login ke admin: `https://your-vercel-url.vercel.app/admin` → Password: `imama123`
   - Edit data dan klik "Simpan ke Server"
   - Refresh halaman utama → data akan update

### Troubleshooting Vercel:

- **Cannot GET /api/...** → Database environment variables belum di-set dengan benar
- **500 error** → Pastikan database credentials benar dan database sudah import `database.sql`
- **Tidak ada data** → Check Vercel logs di dashboard untuk error details

> **Catatan**: Folder `api/` berisi serverless functions yang otomatis di-deploy oleh Vercel tanpa perlu `server.js`.
