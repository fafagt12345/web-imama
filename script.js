// Fungsi untuk menggeser slider kegiatan
function moveEventSlider(direction) {
    const container = document.getElementById('eventsContainer');
    const scrollAmount = 375; // Lebar card + gap
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Fungsi utilitas untuk memformat tanggal
function formatDate(dateStr) {
    if(!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Gambar default jika tidak ada upload
const DEFAULT_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23667eea" width="400" height="200"/><text fill="white" x="50%" y="50%" text-anchor="middle">IMAMA UNESA</text></svg>';

// Fitur Slide Otomatis Hero
async function initHeroSlider() {
    const hero = document.querySelector('.hero');
    const dotsContainer = document.getElementById('heroDots');
    if(!hero || !dotsContainer) return;

    const slides = await ApiService.getHeroSlides();
    const images = slides.length > 0 
        ? slides.map(s => `url("${s.image_data}")`)
        : [`url("https://images.unsplash.com/photo-1523240715630-991c2f746d24?auto=format&fit=crop&w=1200")`];
    
    let current = 0;
    let sliderTimer;

    function updateSlider(index) {
        current = index;
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ${images[current]}`;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function startAutoSlide() {
        sliderTimer = setInterval(() => {
            updateSlider((current + 1) % images.length);
        }, 5000);
    }

    // Create dots
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => {
            clearInterval(sliderTimer);
            updateSlider(i);
            startAutoSlide();
        };
        dotsContainer.appendChild(dot);
    });

    updateSlider(0);
    startAutoSlide();
}

async function loadSettings() {
    const settings = await ApiService.getSettings();
    if(document.getElementById('displayEmail')) document.getElementById('displayEmail').textContent = settings.email;
    if(document.getElementById('displayIg')) document.getElementById('displayIg').textContent = settings.instagram;
    if(document.getElementById('heroTitleDisplay')) document.getElementById('heroTitleDisplay').textContent = settings.hero_title;
    if(document.getElementById('heroSubtitleDisplay')) document.getElementById('heroSubtitleDisplay').innerHTML = settings.hero_subtitle.replace(/\n/g, '<br>');
}

async function loadAbout() {
    const content = await ApiService.getAbout();
    const el = document.getElementById('aboutContent');
    if(el) el.innerHTML = content.replace(/\n/g, '<br>');
    return content;
}

async function loadEvents() {
    try {
        const events = await ApiService.getEvents();
        const container = document.getElementById('eventsContainer');
        if(!container) return;

        if(events.length === 0) {
            container.innerHTML = "<p>Belum ada kegiatan terbaru.</p>";
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="event-card" onclick="showEventDetail('${event.id}')">
                <img src="${event.image || DEFAULT_IMG}" class="event-image">
                <div class="event-content">
                    <span class="category-badge">${event.category || 'Umum'}</span>
                    <h4>${event.title}</h4>
                    <small>${formatDate(event.date)}</small>
                    <p>${event.desc ? event.desc.substring(0, 60) : ''}...</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Gagal memuat kegiatan:", error);
        document.getElementById('eventsContainer').innerHTML = "<p>Gagal terhubung ke server.</p>";
    }
}

async function loadStaff() {
    const staff = await ApiService.getStaff();
    const container = document.getElementById('staffContainer');
    if(!container) return;

    const depts = ['BPH', 'DPM', 'INFOKOM', 'DBM', 'EKRAF', 'DPO', 'KORWIL'];
    
    container.innerHTML = depts.map(dept => {
        const members = staff.filter(s => s.department === dept);
        if(members.length === 0) return '';

        return `
            <div class="dept-section">
                <h3 class="dept-title">${dept}</h3>
                <div class="staff-grid">
                    ${members.map(m => `
                        <div class="staff-card">
                            <img src="${m.image_data || DEFAULT_IMG}" class="staff-img">
                            <span class="staff-name">${m.name}</span>
                            <span class="staff-pos">${m.position}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

async function loadGallery() {
    const gallery = await ApiService.getGallery();
    const container = document.getElementById('galleryContainer');
    if(!container) return;

    container.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" class="gallery-image">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                <p style="font-weight: 500;">${item.caption || 'IMAMA Gallery'}</p>
            </div>
        </div>
    `).join('');
}

async function showEventDetail(id) {
    const events = await ApiService.getEvents();
    const event = events.find(e => e.id == id);
    if(!event) return;

    const modalBody = document.getElementById('eventModalBody');
    modalBody.innerHTML = `
        <img src="${event.image || DEFAULT_IMG}" style="width:100%; border-radius:10px;">
        <h2 style="margin-top:20px;">${event.title}</h2>
        <p style="color:#667eea; font-weight:bold;">${formatDate(event.date)}</p>
        <hr style="margin:15px 0;">
        <p style="white-space: pre-wrap;">${event.desc}</p>
    `;
    document.getElementById('eventModal').style.display = 'block';
}

window.onclick = (e) => {
    if(e.target.className === 'modal') e.target.style.display = 'none';
};

// Fungsi Inisialisasi Utama
async function initApp() {
    await loadSettings(); // Load pengaturan (judul, email, dll)
    await initHeroSlider(); // Jalankan slider hero
    await loadAbout(); // Load konten tentang kami
    await loadEvents(); // Load daftar kegiatan
    await loadStaff(); // Load pengurus
    await loadGallery(); // Load galeri foto

    // Polling untuk update real-time setiap 30 detik
    setInterval(async () => {
        await loadSettings();
        await loadAbout();
        await loadEvents();
        await loadStaff();
        await loadGallery();
        // Reload hero slider jika diperlukan
        await initHeroSlider();
    }, 30000); // 30 detik
}

document.addEventListener('DOMContentLoaded', initApp);