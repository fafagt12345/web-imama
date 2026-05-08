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
const DEFAULT_IMG = '';

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

async function updateSettings(settings) {
    if(document.getElementById('displayEmail')) document.getElementById('displayEmail').textContent = settings.email || '';
    if(document.getElementById('displayIg')) document.getElementById('displayIg').textContent = settings.instagram || '';
    if(document.getElementById('heroTitleDisplay')) document.getElementById('heroTitleDisplay').textContent = settings.hero_title || '';
    if(document.getElementById('heroSubtitleDisplay')) document.getElementById('heroSubtitleDisplay').innerHTML = (settings.hero_subtitle || '').replace(/\n/g, '<br>');
}

async function updateAbout(about) {
    const el = document.getElementById('aboutContent');
    if(el) el.innerHTML = (about.intro || '').replace(/\n/g, '<br>');
}

async function updateEvents(events) {
    const container = document.getElementById('eventsContainer');
    if(!container) return;

    if(events.length === 0) {
        container.innerHTML = "<p>Belum ada kegiatan terbaru.</p>";
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="event-card" onclick="showEventDetail('${event.id || event.title}')">
            <img src="${event.image || event.image_data || DEFAULT_IMG}" class="event-image">
            <div class="event-content">
                <span class="category-badge">${event.category || 'Umum'}</span>
                <h4>${event.title}</h4>
                <small>${formatDate(event.date || event.event_date)}</small>
                <p>${event.desc || event.description ? (event.desc || event.description).substring(0, 60) : ''}...</p>
            </div>
        </div>
    `).join('');
}

async function updateStaff(staff) {
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

async function updateGallery(gallery) {
    const container = document.getElementById('galleryContainer');
    if(!container) return;

    container.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.image || item.image_data || DEFAULT_IMG}" class="gallery-image">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                <p style="font-weight: 500;">${item.caption || 'IMAMA Gallery'}</p>
            </div>
        </div>
    `).join('');
}

async function showEventDetail(id) {
    const event = window.currentData.events.find(e => e.id == id || e.title == id);
    if(!event) return;

    const modalBody = document.getElementById('eventModalBody');
    modalBody.innerHTML = `
        <img src="${event.image || event.image_data || DEFAULT_IMG}" style="width:100%; border-radius:10px;">
        <h2 style="margin-top:20px;">${event.title}</h2>
        <p style="color:#667eea; font-weight:bold;">${formatDate(event.date || event.event_date)}</p>
        <hr style="margin:15px 0;">
        <p style="white-space: pre-wrap;">${event.desc || event.description}</p>
    `;
    document.getElementById('eventModal').style.display = 'block';
}

window.onclick = (e) => {
    if(e.target.className === 'modal') e.target.style.display = 'none';
};

async function updateHero(slides) {
    const hero = document.querySelector('.hero');
    if(!hero || !slides.length) return;
    const image = slides[0].image_data || slides[0].image || '';
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${image}")`;
}

// Fungsi Inisialisasi Utama
async function initApp() {
    // Real-time listener for data
    const { doc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
    const docRef = doc(window.db, 'data', 'main');
    onSnapshot(docRef, (docSnap) => {
        const data = docSnap.exists() ? docSnap.data() : {
            about: { intro: '', history: '', logo: '', philosophy: '', vision: '' },
            settings: {},
            hero_slides: [],
            events: [],
            gallery: [],
            staff: [],
            timeline: []
        };

        // Update UI
        updateSettings(data.settings);
        updateAbout(data.about);
        updateHero(data.hero_slides);
        updateEvents(data.events);
        updateStaff(data.staff);
        updateGallery(data.gallery);
    });
}

document.addEventListener('DOMContentLoaded', initApp);