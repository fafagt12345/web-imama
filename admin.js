const STORAGE_KEY = 'imamaSiteData';
const AUTH_KEY = 'imamaAdmin';
const API_URL = '/api/data'; // Endpoint untuk Vercel Serverless Function

const defaultData = {
  hero: {
    title: 'Membangun Solidaritas Mahasiswa Magetan di Universitas Negeri Surabaya',
    subtitle: 'IMAMA Magetan UNESA hadir untuk memperkuat rasa kekeluargaan, profesionalisme, dan semangat rantau di Surabaya.',
    ctaPrimary: 'Gabung IMAMA',
    ctaSecondary: 'Lihat Kegiatan'
  },
  about: {
    intro: 'IMAMA Magetan UNESA adalah wadah aspirasi dan solidaritas mahasiswa Magetan yang menuntut ilmu di Universitas Negeri Surabaya. Kami bergerak dalam kegiatan pengembangan organisasi, sosial, akademik, dan budaya rantau.',
    history: 'Bermula dari kumpulan mahasiswa rantau Magetan yang ingin menyatukan tekad dan budaya, IMAMA lahir sebagai identitas kebersamaan untuk berbagi kekuatan selama studi.',
    logo: 'Logo IMAMA merepresentasikan dua sisi: akar Magetan yang kuat dan ruang gerak inovasi di dunia kampus.',
    philosophy: 'Filosofi kami adalah “Rantau Terikat, Karya Terbuka” — menjaga nilai keluarga asal, sambil berkembang bersama dalam kebersamaan akademik.',
    vision: 'Menjadi organisasi mahasiswa Magetan yang progresif, aktif, dan menjadi inspirasi solidaritas rantau di lingkungan kampus.'
  },
  departments: [
    { name: 'BPH', color: 'from-emerald-500 to-emerald-700', desc: 'Koordinasi strategis dan penguatan organisasi.', leader: 'Ahmad Fulan', members: 42, icon: '🛡️' },
    { name: 'DPM', color: 'from-slate-500 to-slate-700', desc: 'Pengawasan dan kebijakan internal.', leader: 'Nadia Hapsari', members: 18, icon: '📜' },
    { name: 'DBM', color: 'from-amber-400 to-amber-600', desc: 'Keuangan organisasi dan pendanaan kegiatan.', leader: 'Rian Pratama', members: 16, icon: '💰' },
    { name: 'DPO', color: 'from-cyan-500 to-cyan-700', desc: 'Pengabdian masyarakat dan event sosial.', leader: 'Siti Anisa', members: 24, icon: '🤝' },
    { name: 'EKRAF', color: 'from-pink-500 to-pink-700', desc: 'Kegiatan kreatif dan seni budaya.', leader: 'Lina Kartika', members: 20, icon: '🎨' },
    { name: 'INFOKOM', color: 'from-violet-500 to-violet-700', desc: 'Komunikasi digital dan dokumentasi.', leader: 'Dio Prasetyo', members: 26, icon: '💡' },
    { name: 'KORWIL', color: 'from-emerald-300 to-emerald-500', desc: 'Koordinasi wilayah dan jaringan rantau.', leader: 'Maya Lestari', members: 30, icon: '🌍' }
  ],
  officers: [
    { name: 'Ahmad Fulan', role: 'Ketua Umum', major: 'Teknik Informatika', batch: '2024', dept: 'BPH', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=600&q=80' },
    { name: 'Nadia Hapsari', role: 'Sekretaris', major: 'Manajemen', batch: '2024', dept: 'DPM', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rian Pratama', role: 'Bendahara', major: 'Akuntansi', batch: '2024', dept: 'DBM', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' }
...
  timeline: [
    { year: '2020', event: 'IMAMA berdiri sebagai organisasi mahasiswa rantau Magetan di UNESA.' },
    { year: '2022', event: 'Pelantikan kepengurusan dan perluasan program bakti sosial.' },
    { year: '2024', event: 'Pencapaian membership 200+ dan penguatan visi baru.' }
  ],
  contact: {
    whatsapp: '+6281234567890',
    instagram: 'imama.magetan',
    email: 'admin@imamaunesa.org',
    address: 'Sekretariat IMAMA UNESA, Surabaya'
  },
  stats: [
    { label: 'Anggota Aktif', value: '200+' },
    { label: 'Departemen', value: '7' },
    { label: 'Kegiatan', value: '35' },
    { label: 'Alumni', value: '150+' }
  ]
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

// 2. Fungsi Simpan Data ke Server
async function saveToServer() {
    const password = localStorage.getItem(AUTH_KEY);
    if (!password) return alert("Silakan login kembali.");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: password,
                data: currentData
            })
        });

        const result = await response.json();
        if (result.success) {
            alert("Data berhasil disimpan dan disinkronkan!");
        } else {
            alert("Gagal menyimpan: " + result.message);
        }
    } catch (error) {
        alert("Terjadi kesalahan koneksi ke server.");
    }
}

// 3. Logika Real-time (Polling)
// Cek perubahan dari server setiap 10 detik agar sinkron antar perangkat
setInterval(loadData, 10000);

// 4. Event Listeners untuk Form (Contoh untuk Form About)
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const aboutForm = document.getElementById('aboutForm');
    if (aboutForm) {
        aboutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentData.about.intro = document.getElementById('aboutText').value;
            currentData.about.history = document.getElementById('aboutHistory')?.value || '';
            currentData.about.vision = document.getElementById('aboutVision')?.value || '';
            saveToServer();
        });
    }
    
    // Tambahkan listener untuk form hero, kontak, dll sesuai kebutuhan
});

function renderAllEditors() {
    if (!currentData) return;

    // About Section
    if (document.getElementById('aboutText')) 
        document.getElementById('aboutText').value = currentData.about?.intro || '';
    
    if (document.getElementById('aboutHistory')) 
        document.getElementById('aboutHistory').value = currentData.about?.history || '';

    if (document.getElementById('aboutVision')) 
        document.getElementById('aboutVision').value = currentData.about?.vision || '';

    // Hero Section
    if (document.getElementById('heroTitle')) 
        document.getElementById('heroTitle').value = currentData.settings?.hero_title || currentData.hero?.title || '';

    if (document.getElementById('heroSubtitle'))
        document.getElementById('heroSubtitle').value = currentData.settings?.hero_subtitle || currentData.hero?.subtitle || '';

    // Contact Settings
    if (document.getElementById('contactEmail'))
        document.getElementById('contactEmail').value = currentData.settings?.email || currentData.contact?.email || '';
    
    if (document.getElementById('contactIg'))
        document.getElementById('contactIg').value = currentData.settings?.instagram || currentData.contact?.instagram || '';
    
    console.log("Panel Admin diperbarui dengan data terbaru dari server");
}

function loadLocalData() {}