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
    if(!hero) return;

    const slides = await ApiService.getHeroSlides();
    const images = slides.length > 0 
        ? slides.map(s => `url("${s.image_data}")`)
        : [`url("https://images.unsplash.com/photo-1523240715630-991c2f746d24?auto=format&fit=crop&w=1200")`];
    
    if(images.length > 0) hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ${images[0]}`;

    let current = 0;
    setInterval(() => {
        current = (current + 1) % images.length;
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ${images[current]}`;
    }, 5000);
}

async function loadSettings() {
    const settings = await ApiService.getSettings();
    if(document.getElementById('displayEmail')) document.getElementById('displayEmail').textContent = settings.email;
    if(document.getElementById('displayIg')) document.getElementById('displayIg').textContent = settings.instagram;
    if(document.getElementById('heroTitleDisplay')) document.getElementById('heroTitleDisplay').textContent = settings.hero_title;
    if(document.getElementById('heroSubtitleDisplay')) document.getElementById('heroSubtitleDisplay').textContent = settings.hero_subtitle;
}

async function loadAbout() {
    const content = await ApiService.getAbout();
    const el = document.getElementById('aboutContent');
    if(el) el.textContent = content;
    return content;
}

async function loadEvents() {
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
                <p>${event.desc.substring(0, 60)}...</p>
            </div>
        </div>
    `).join('');
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
            <div style="padding: 10px; text-align: center;">${item.caption || ''}</div>
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
}

document.addEventListener('DOMContentLoaded', initApp);