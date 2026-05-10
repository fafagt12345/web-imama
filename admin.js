const STORAGE_KEY = 'imamaSiteData';
const defaultData = {
  hero: { title: '', subtitle: '' },
  about: { intro: '', history: '', vision: '' },
  settings: { email: '', instagram: '', hero_title: '', hero_subtitle: '' },
  events: [],
  staff: [],
  gallery: [],
  timeline: []
};

let currentData = { ...defaultData };

// 1. Fungsi Load Data dari Server
async function loadData() {
    try {
        const serverData = await ApiService.exportAll();
        // Gabungkan data server dengan default agar tidak ada field yang hilang
        currentData = serverData ? { ...defaultData, ...serverData } : { ...defaultData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        renderAllEditors();
    } catch (error) {
        console.error("Gagal memuat data dari server:", error);
        // Fallback ke local storage
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) currentData = JSON.parse(local);
        // PENTING: Tetap jalankan render agar halaman tidak kosong meskipun server mati
        renderAllEditors();
    }
}

// 2. Fungsi Render (Memasukkan data ke Input HTML)
function renderAllEditors() {
    if (!currentData) return;
    
    // Hero Section
    if (document.getElementById('heroTitle')) document.getElementById('heroTitle').value = currentData.hero?.title || '';
    if (document.getElementById('heroSubtitle')) document.getElementById('heroSubtitle').value = currentData.hero?.subtitle || '';

    // About Section
    if (document.getElementById('aboutText')) document.getElementById('aboutText').value = currentData.about?.intro || '';
    if (document.getElementById('aboutHistory')) document.getElementById('aboutHistory').value = currentData.about?.history || '';
    if (document.getElementById('aboutVision')) document.getElementById('aboutVision').value = currentData.about?.vision || '';

    // Contact Settings
    if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = currentData.settings?.email || '';
    if (document.getElementById('contactIg')) document.getElementById('contactIg').value = currentData.settings?.instagram || '';
    
    console.log("Admin UI Synchronized");
}

// 3. Fungsi Simpan Global
window.saveAllData = async function() {
    // Update currentData dari input sebelum dikirim
    currentData.hero.title = document.getElementById('heroTitle')?.value || '';
    currentData.hero.subtitle = document.getElementById('heroSubtitle')?.value || '';
    currentData.about.intro = document.getElementById('aboutText')?.value || '';
    currentData.about.history = document.getElementById('aboutHistory')?.value || '';
    currentData.about.vision = document.getElementById('aboutVision')?.value || '';
    
    if (!currentData.settings) currentData.settings = {};
    currentData.settings.email = document.getElementById('contactEmail')?.value || '';
    currentData.settings.instagram = document.getElementById('contactIg')?.value || '';
    
    // Samakan dengan struktur hero untuk index.html
    currentData.settings.hero_title = currentData.hero.title;
    currentData.settings.hero_subtitle = currentData.hero.subtitle;

    try {
        await ApiService.bulkImport(currentData);
        alert("✓ Data berhasil disimpan ke MySQL dan sinkron ke semua perangkat!");
    } catch (err) {
        alert("Gagal menyimpan: " + err.message);
    }
};

// Inisialisasi & Polling setiap 10 detik agar admin lain juga sinkron
document.addEventListener('DOMContentLoaded', loadData);
setInterval(loadData, 10000);

function loadLocalData() {}