<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMAMA UNESA - Ikatan Mahasiswa Manajemen Akuntansi</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Navbar */
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .nav-logo i {
            margin-right: 10px;
            font-size: 2rem;
        }

        .nav-menu {
            display: flex;
            align-items: center;
            gap: 30px;
        }

        .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }

        .nav-link:hover {
            opacity: 0.8;
        }

        .admin-btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
        }

        .admin-btn:hover {
            background: white;
            color: #667eea;
        }

        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background: white;
            margin: 3px 0;
            transition: 0.3s;
        }

        /* Hero */
        .hero {
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23667eea" width="1200" height="600"/><circle fill="%23764ba2" opacity="0.3" cx="300" cy="200" r="150"/><circle fill="%23f093fb" opacity="0.4" cx="900" cy="400" r="120"/></svg>');
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }

        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: fadeInUp 1s ease;
        }

        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            animation: fadeInUp 1s ease 0.2s both;
        }

        .cta-btn {
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
            animation: fadeInUp 1s ease 0.4s both;
        }

        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255,107,107,0.4);
        }

        /* Sections */
        section {
            padding: 100px 0;
        }

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: #333;
        }

        /* About */
        .about {
            background: #f8f9fa;
        }

        #aboutContent {
            max-width: 800px;
            margin: 0 auto;
            font-size: 1.1rem;
            text-align: center;
            line-height: 1.8;
        }

        /* Events */
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .event-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: all 0.3s;
            cursor: pointer;
        }

        .event-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .event-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
        }

        .event-content {
            padding: 25px;
        }

        .event-title {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #333;
        }

        .event-date {
            color: #667eea;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .event-desc {
            color: #666;
            line-height: 1.6;
        }

        .add-btn {
            display: block;
            margin: 40px auto 0;
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .add-btn:hover {
            background: #5a67d8;
            transform: translateY(-2px);
        }

        /* Gallery */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .gallery-item {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            height: 250px;
        }

        .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }

        .gallery-item:hover .gallery-image {
            transform: scale(1.1);
        }

        .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 20px;
            transform: translateY(100%);
            transition: transform 0.3s;
        }

        .gallery-item:hover .gallery-caption {
            transform: translateY(0);
        }

        /* Contact */
        .contact {
            background: #f8f9fa;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            max-width: 800px;
            margin: 0 auto;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 1.1rem;
        }

        .contact-item i {
            width: 50px;
            height: 50px;
            background: #667eea;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background: white;
            margin: 10% auto;
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 400px;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        }

        .modal-content.large {
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
        }

        .close:hover {
            color: #333;
        }

        .modal-content h2 {
            margin-bottom: 20px;
            color: #333;
        }

        .modal-content form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .modal-content input,
        .modal-content textarea {
            padding: 15px;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .modal-content input:focus,
        .modal-content textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .modal-content button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .modal-content button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }

        /* Admin Panel */
        .admin-panel {
            position: fixed;
            top: 80px;
            right: -400px;
            width: 400px;
            height: calc(100vh - 80px);
            background: white;
            box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            z-index: 1500;
            transition: right 0.3s ease;
        }

        .admin-panel.active {
            right: 0;
        }

        .admin-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logout-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
        }

        .admin-tabs {
            display: flex;
            border-bottom: 1px solid #eee;
        }

        .tab-btn {
            flex: 1;
            padding: 15px;
            border: none;
            background: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .tab-btn.active {
            background: #667eea;
            color: white;
        }

        .tab-content {
            height: calc(100% - 140px);
            overflow-y: auto;
        }

        .admin-form {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .admin-form textarea {
            resize: vertical;
            min-height: 100px;
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.8) translateY(-50px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hamburger { display: flex; }
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background: rgba(102,126,234,0.95);
                width: 100%;
                text-align: center;
                padding: 20px 0;
                transition: left 0.3s;
            }
            .nav-menu.active { left: 0; }
            .hero-content h1 { font-size: 2.5rem; }
            .events-grid { grid-template-columns: 1fr; }
            .admin-panel { width: 100%; right: -100%; }
        }
    </style>
</head>
<body>
    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeLogin()">&times;</span>
            <h2><i class="fas fa-lock"></i> Admin Login</h2>
            <form id="loginForm">
                <input type="password" id="password" placeholder="Password Admin" required>
                <button type="submit"><i class="fas fa-sign-in-alt"></i> Masuk</button>
            </form>
        </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-graduation-cap"></i>
                <span>IMAMA UNESA</span>
            </div>
            <div class="nav-menu" id="navMenu">
                <a href="#home" class="nav-link">Beranda</a>
                <a href="#about" class="nav-link">Tentang</a>
                <a href="#events" class="nav-link">Kegiatan</a>
                <a href="#gallery" class="nav-link">Galeri</a>
                <a href="#contact" class="nav-link">Kontak</a>
                <button id="adminBtn" class="admin-btn" onclick="openLogin()">
                    <i class="fas fa-cog"></i> Admin
                </button>
            </div>
            <div class="hamburger" onclick="toggleMenu()">
                <span></span><span></span><span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>IMAMA UNESA</h1>
            <p>Ikatan Mahasiswa Manajemen Akuntansi<br>Universitas Negeri Surabaya</p>
            <a href="#events" class="cta-btn">Lihat Kegiatan <i class="fas fa-arrow-down"></i></a>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2><i class="fas fa-info-circle"></i> Tentang IMAMA</h2>
            <div id="aboutContent">
                IMAMA UNESA adalah organisasi mahasiswa jurusan Manajemen Akuntansi yang bertujuan untuk mengembangkan potensi mahasiswa melalui berbagai kegiatan akademik, non-akademik, dan pengabdian masyarakat.
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="events">
        <div class="container">
            <h2><i class="fas fa-calendar-alt"></i> Kegiatan Terbaru</h2>
            <div id="eventsContainer" class="events-grid">
                <!-- Events loaded dynamically -->
            </div>
            <button id="addEventBtn" class="add-btn" style="display:none;">
                <i class="fas fa-plus"></i> Tambah Kegiatan
            </button>
        </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="gallery">
        <div class="container">
            <h2><i class="fas fa-images"></i> Galeri</h2>
            <div id="galleryContainer" class="gallery-grid">
                <!-- Gallery loaded dynamically -->
            </div>
            <button id="addGalleryBtn" class="add-btn" style="display:none;">
                <i class="fas fa-plus"></i> Tambah Foto
            </button>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2><i class="fas fa-phone"></i> Hubungi Kami</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>imama.unesa@gmail.com</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>0812-3456-7890</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Kampus UNESA Lidah Wetan, Surabaya</span>
                </div>
                <div class="contact-item">
                    <i class="fab fa-instagram"></i>
                    <span>@imama_unesa</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Admin Panel -->
    <div id="adminPanel" class="admin-panel">
        <div class="admin-header">
            <h3><i class="fas fa-cogs"></i> Panel Admin</h3>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
        <div class="admin-tabs">
            <button class="tab-btn active" onclick="showTab('events-tab')">
                <i class="fas fa-calendar"></i> Kegiatan
            </button>
            <button class="tab-btn" onclick="showTab('gallery-tab')">
                <i class="fas fa-images"></i> Galeri
            </button>
            <button class="tab-btn" onclick="showTab('about-tab')">
                <i class="fas fa-info"></i> Tentang
            </button>
        </div>
        
        <div id="events-tab" class="tab-content">
            <form id="eventForm" class="admin-form">
                <input type="hidden" id="eventId">
                <input type="text" id="eventTitle" placeholder="Judul Kegiatan *" required>
                <textarea id="eventDesc" placeholder="Deskripsi lengkap kegiatan *" required></textarea>
                <input type="date" id="eventDate" required>
                <input type="file" id="eventImage" accept="image/*">
                <small>Gunakan foto poster kegiatan (JPG/PNG)</small>
                <button type="submit"><i class="fas fa-save"></i> Simpan Kegiatan</button>
            </form>
        </div>

        <div id="gallery-tab" class="tab-content" style="display:none;">
            <form id="galleryForm" class="admin-form">
                <input type="hidden" id="galleryId">
                <input type="file" id="galleryImage" accept="image/*" required>
                <input type="text" id="galleryCaption" placeholder="Keterangan foto (opsional)">
                <small>Ukuran foto ideal: 800x600px</small>
                <button type="submit"><i class="fas fa-save"></i> Tambah Foto</button>
            </form>
        </div>

        <div id="about-tab" class="tab-content" style="display:none;">
            <form id="aboutForm" class="admin-form">
                <textarea id="aboutText" placeholder="Tulis tentang IMAMA *" required></textarea>
                <small>Teks akan muncul di halaman Tentang</small>
                <button type="submit"><i class="fas fa-save"></i> Update Tentang</button>
            </form>
        </div>
    </div>

    <!-- Event Modal -->
    <div id="eventModal" class="modal">
        <div class="modal-content large">
            <span class="close" onclick="closeEventModal()">&times;</span>
            <div id="eventModalContent"></div>
        </div>
    </div>

    <script>
        // === KONFIGURASI ===
        const ADMIN_PASSWORD = 'imama123'; // GANTI PASSWORD INI
        
        let isAdmin = localStorage.getItem('imama_admin') === 'true';

        // === INIT ===
        document.addEventListener('DOMContentLoaded', function() {
            checkAdminStatus();
            loadAllData();
            setupSmoothScroll();
        });

        // === ADMIN LOGIN ===
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            if (password === ADMIN_PASSWORD) {
                localStorage.setItem('imama_admin', 'true');
                isAdmin = true;
                checkAdminStatus();
                closeLogin();
                alert('✅ Login berhasil!');
            } else {
                alert('❌ Password salah!');
                document.getElementById('password').value = '';
            }
        });

        function checkAdminStatus() {
            if (isAdmin) {
                document.getElementById('adminPanel').style.display = 'block';
                setTimeout(() => document.getElementById('adminPanel').classList.add('active'), 10);
                showAdminButtons();
            }
        }

        function showAdminButtons() {
            document.getElementById('addEventBtn').style.display = 'block';
            document.getElementById('addGalleryBtn').style.display = 'block';
            document.getElementById('adminBtn').style.display = 'none';
        }

        // === MODAL CONTROLS ===
        function openLogin() { document.getElementById('loginModal').style.display = 'block'; }
        function closeLogin() { document.getElementById('loginModal').style.display = 'none'; }
        function closeEventModal() { document.getElementById('eventModal').style.display = 'none'; }
        function logout() {
            localStorage.removeItem('imama_admin');
            isAdmin = false;
            document.getElementById('adminPanel').classList.remove('active');
            setTimeout(() => document.getElementById('adminPanel').style.display = 'none', 300);
            document.getElementById('addEventBtn').style.display = 'none';
            document.getElementById('addGalleryBtn').style.display = 'none';
            document.getElementById('adminBtn').style.display = 'block';
            alert('👋 Logout berhasil');
        }

        // === LOAD DATA ===
        function loadAllData() {
            loadAbout();
            loadEvents();
            loadGallery();
        }

        function loadAbout() {
            const about = localStorage.getItem('imama_about') || 
                'IMAMA UNESA adalah organisasi mahasiswa jurusan Manajemen Akuntansi Universitas Negeri Surabaya yang bertujuan mengembangkan potensi anggota melalui kegiatan akademik, kepemimpinan, dan pengabdian masyarakat.';
            document.getElementById('aboutContent').textContent = about;
            document.getElementById('aboutText').value = about;
        }

        function loadEvents() {
            const events = JSON.parse(localStorage.getItem('imama_events')) || [];
            const container = document.getElementById('eventsContainer');
            
            if (events.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">
                        <i class="fas fa-calendar-times" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <p>Belum ada kegiatan.<br><strong>Admin bisa menambahkan kegiatan pertama!</strong></p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = events.map(event => `
                <div class="event-card" onclick="openEventModal('${event.id}')">
                    <img src="${event.image || getDefaultPoster()}" alt="${event.title}" class="event-image">
                    <div class="event-content">
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-date">${formatDate(event.date)}</div>
                        <p class="event-desc">${event.desc.substring(0, 100)}${event.desc.length > 100 ? '...' : ''}</p>
                    </div>
                </div>
            `).join('');
        }

        function loadGallery() {
            const gallery = JSON.parse(localStorage.getItem('imama_gallery')) || [];
            const container = document.getElementById('galleryContainer');
            
            if (gallery.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">
                        <i class="fas fa-images" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <p>Belum ada foto galeri.<br><strong>Admin bisa upload foto kegiatan!</strong></p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = gallery.map(item => `
                <div class="gallery-item">
                    <img src="${item.image}" alt="${item.caption}" class="gallery-image">
                    <div class="gallery-caption">
                        <h4>${item.caption || 'Galeri Kegiatan'}</h4>
                    </div>
                </div>
            `).join('');
        }

        // === EVENT MANAGEMENT ===
        document.getElementById('addEventBtn').onclick = () => {
            showTab('events-tab');
            document.getElementById('eventForm').scrollIntoView({behavior: 'smooth'});
        };

        document.getElementById('eventForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('eventId').value || Date.now().toString();
            const title = document.getElementById('eventTitle').value;
            const desc = document.getElementById('eventDesc').value;
            const date = document.getElementById('eventDate').value;
            const imageFile = document.getElementById('eventImage').files[0];
            
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => saveEvent(id, title, desc, date, e.target.result);
                reader.readAsDataURL(imageFile);
            } else {
                saveEvent(id, title, desc, date, null);
            }
        });

        function saveEvent(id, title, desc, date, image) {
            const events = JSON.parse(localStorage.getItem('imama_events')) || [];
            const index = events.findIndex(e => e.id === id);
            const eventData = { id, title, desc, date, image };
            
            if (index > -1) events[index] = eventData;
            else events.unshift(eventData);
            
            localStorage.setItem('imama_events', JSON.stringify(events));
            loadEvents();
            document.getElementById('eventForm').reset();
            alert('✅ Kegiatan berhasil disimpan!');
        }

        // === GALLERY MANAGEMENT ===
        document.getElementById('addGalleryBtn').onclick = () => showTab('gallery-tab');

        document.getElementById('galleryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const imageFile = document.getElementById('galleryImage').files[0];
            if (!imageFile) return alert('❌ Pilih foto terlebih dahulu!');
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const id = Date.now().toString();
                const caption = document.getElementById('galleryCaption').value;
                saveGallery(id, e.target.result, caption);
            };
            reader.readAsDataURL(imageFile);
        });

        function saveGallery(id, image, caption) {
            const gallery = JSON.parse(localStorage.getItem('imama_gallery')) || [];
            gallery.unshift({ id, image, caption });
            localStorage.setItem('imama_gallery', JSON.stringify(gallery));
            loadGallery();
            document.getElementById('galleryForm').reset();
            alert('✅ Foto berhasil ditambahkan!');
        }

        // === ABOUT MANAGEMENT ===
        document.getElementById('aboutForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const aboutText = document.getElementById('aboutText').value;
            localStorage.setItem('imama_about', aboutText);
            loadAbout();
            alert('✅ Halaman Tentang berhasil diupdate!');
        });

        // === UTILITIES ===
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabName).style.display = 'block';
            event.target.classList.add('active');
        }

        function openEventModal(id) {
            const events = JSON.parse(localStorage.getItem('imama_events')) || [];
            const event = events.find(e => e.id === id);
            if (!event) return;
            
            document.getElementById('eventModalContent').innerHTML = `
                <img src="${event.image || getDefaultPoster()}" alt="${event.title}" style="width:100%; height:400px; object-fit:cover; border-radius:15px; margin-bottom:25px;">
                <h2 style="color:#333; margin-bottom:15px;">${event.title}</h2>
                <div style="color:#667eea; font-weight:bold; font-size:1.2rem; margin-bottom:20px;">
                    📅 ${formatDate(event.date)}
                </div>
                <div style="line-height:1.8; font-size:1.1rem; color:#555;">${event.desc}</div>
            `;
            document.getElementById('eventModal').style.display = 'block';
        }

        function getDefaultPoster() {
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect fill="%23667eea" width="400" height="250"/><rect fill="%23764ba2" x="50" y="50" width="300" height="150" rx="10"/><text fill="white" font-size="24" x="200" y="140" text-anchor="middle" font-weight="bold">EVENT IMAMA</text><text fill="white" font-size="16" x="200" y="170" text-anchor="middle" opacity="0.9">UNESA</text></svg>';
        }

        function formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
        }

        function setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }

        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }

        // Close modals on outside click
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            navbar.style.background = window.scrollY > 100 ? 
                'rgba(102, 126, 234, 0.95)' : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.backdropFilter = window.scrollY > 100 ? 'blur(10px)' : 'none';
        });
    </script>
</body>
</html>