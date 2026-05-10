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

    // Gunakan data dari window.currentData yang sudah dipoll
    const slides = window.currentData?.hero_slides || [];
    const images = slides.length > 0 
        ? slides.map(s => `url("${s.image_data || s.image}")`)
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

// Fungsi Inisialisasi Utama
async function initApp() {
    // Load initial data from localStorage
    try {
        const rawData = await ApiService.exportAll();
        await updateUI(rawData);
        window.currentData = rawData;
    } catch (err) {
        console.error('Load data error:', err);
    }

    // Poll for updates every 5 seconds
    setInterval(async () => {
        try {
            const rawData = await ApiService.exportAll();
            await updateUI(rawData);
            window.currentData = rawData;
        } catch (err) {
            console.error('Poll error:', err);
        }
    }, 5000);
}

async function updateUI(data) {
    if (!data) return;
    // Settings
    if (document.getElementById('displayEmail')) document.getElementById('displayEmail').textContent = data.settings?.email || '';
    if (document.getElementById('displayIg')) document.getElementById('displayIg').textContent = data.settings?.instagram || '';
    if (document.getElementById('heroTitleDisplay')) document.getElementById('heroTitleDisplay').textContent = data.settings?.hero_title || data.hero?.title || '';
    if (document.getElementById('heroSubtitleDisplay')) document.getElementById('heroSubtitleDisplay').innerHTML = (data.settings?.hero_subtitle || data.hero?.subtitle || '').replace(/\n/g, '<br>');

    // About
    const aboutEl = document.getElementById('aboutContent');
    if(aboutEl) aboutEl.innerHTML = (data.about?.intro || '').replace(/\n/g, '<br>');

    // Hero
    const hero = document.querySelector('.hero');
    if(hero && data.hero_slides?.length) {
        const image = data.hero_slides[0].image_data || data.hero_slides[0].image || '';
        if(image) hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${image}")`;
    }

    // Events
    const eventsContainer = document.getElementById('eventsContainer');
    if(eventsContainer) {
        if(!data.events?.length) {
            eventsContainer.innerHTML = "<p>Belum ada kegiatan terbaru.</p>";
        } else {
            eventsContainer.innerHTML = data.events.map(event => `
                <div class="event-card">
                    <img src="${event.image || event.image_data || ''}" class="event-image" onerror="this.style.display='none'">
                    <div class="event-content">
                        <span class="category-badge">${event.category || 'Umum'}</span>
                        <h4>${event.title}</h4>
                        <small>${formatDate(event.date || event.event_date)}</small>
                        <p>${(event.desc || event.description || '').substring(0, 60)}...</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Staff
    const staffContainer = document.getElementById('staffContainer');
    if(staffContainer && data.staff?.length) {
        const depts = ['BPH', 'DPM', 'INFOKOM', 'DBM', 'EKRAF', 'DPO', 'KORWIL'];
        staffContainer.innerHTML = depts.map(dept => {
            const members = data.staff.filter(s => s.department === dept);
            if(members.length === 0) return '';
            return `
                <div class="dept-section">
                    <h3 class="dept-title">${dept}</h3>
                    <div class="staff-grid">
                        ${members.map(m => `
                            <div class="staff-card">
                                <img src="${m.image_data || m.image || ''}" class="staff-img" onerror="this.style.display='none'">
                                <span class="staff-name">${m.name}</span>
                                <span class="staff-pos">${m.position}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Gallery
    const galleryContainer = document.getElementById('galleryContainer');
    if(galleryContainer && data.gallery?.length) {
        galleryContainer.innerHTML = data.gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.image || item.image_data || ''}" class="gallery-image" onerror="this.style.display='none'">
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', initApp);