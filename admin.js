const PASS = "imama123";

document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    if(document.getElementById('aboutInput')) {
        const aboutVal = await ApiService.getAbout();
        document.getElementById('aboutInput').value = aboutVal;
        loadSettingsToInputs();
        loadManagementLists();
    }
});

async function loadSettingsToInputs() {
    const s = await ApiService.getSettings();
    document.getElementById('setHeroTitle').value = s.hero_title || '';
    document.getElementById('setHeroSubtitle').value = s.hero_subtitle || '';
    document.getElementById('setEmail').value = s.email || '';
    document.getElementById('setIg').value = s.instagram || '';
}

async function saveSettings() {
    const settings = {
        hero_title: document.getElementById('setHeroTitle').value,
        hero_subtitle: document.getElementById('setHeroSubtitle').value,
        email: document.getElementById('setEmail').value,
        instagram: document.getElementById('setIg').value
    };
    await ApiService.updateSettings(settings);
    alert("Pengaturan disimpan!");
    location.reload();
}

async function uploadHeroSlide() {
    const file = document.getElementById('heroImageInput').files[0];
    if(!file) return alert("Pilih gambar!");
    const imageData = await toBase64(file);
    console.log("Admin: Image data generated (length):", imageData.length);
    await ApiService.addHeroSlide(imageData);
    alert("Slide ditambahkan!");
    loadManagementLists();
}

async function loadManagementLists() {
    const slides = await ApiService.getHeroSlides();
    document.getElementById('manageHeroSlides').innerHTML = slides.map(s => `
        <div class="manage-item">
            <img src="${s.image_data}" style="height:40px; border-radius:4px;">
            <button class="btn-delete" onclick="deleteHeroSlide(${s.id})">Hapus</button>
        </div>
    `).join('');

    const events = await ApiService.getEvents();
    document.getElementById('manageEvents').innerHTML = '<h4>Kelola Kegiatan:</h4>' + events.map(e => `
        <div class="manage-item">
            <span>${e.title}</span>
            <button class="btn-delete" onclick="deleteEvent(${e.id})">Hapus</button>
        </div>
    `).join('');

    const staff = await ApiService.getStaff();
    document.getElementById('manageStaff').innerHTML = '<h4>Kelola Pengurus:</h4>' + staff.map(s => `
        <div class="manage-item">
            <span>${s.name} (${s.department})</span>
            <button class="btn-delete" onclick="deleteStaff(${s.id})">Hapus</button>
        </div>
    `).join('');

    const gallery = await ApiService.getGallery();
    document.getElementById('manageGallery').innerHTML = '<h4>Kelola Galeri:</h4>' + gallery.map(g => `
        <div class="manage-item">
            <span>Foto ID: ${g.id}</span>
            <button class="btn-delete" onclick="deleteGallery(${g.id})">Hapus</button>
        </div>
    `).join('');
}

async function deleteHeroSlide(id) {
    if(confirm('Hapus slide ini?')) {
        await ApiService.deleteHeroSlide(id);
        loadManagementLists();
    }
}

async function deleteStaff(id) {
    if(confirm('Hapus pengurus ini?')) {
        await ApiService.deleteStaff(id);
        loadManagementLists();
    }
}

async function deleteEvent(id) {
    if(confirm('Hapus kegiatan ini?')) {
        await ApiService.deleteEvent(id);
        loadManagementLists();
    }
}

async function deleteGallery(id) {
    if(confirm('Hapus foto ini?')) {
        await ApiService.deleteGallery(id);
        loadManagementLists();
    }
}

function handleLogin() {
    const input = document.getElementById('adminPassword').value;
    if(input === PASS) {
        localStorage.setItem('imama_is_admin', 'true');
        checkAuth();
    } else {
        alert("Password Salah!");
    }
}

function checkAuth() {
    const isAdmin = localStorage.getItem('imama_is_admin') === 'true';
    if(isAdmin) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('imama_is_admin');
    location.reload();
}

async function updateAbout() {
    const text = document.getElementById('aboutInput').value;
    try {
        await ApiService.updateAbout(text);
        alert("Konten Tentang Kami berhasil diperbarui!");
    } catch (err) {
        alert("Gagal memperbarui data: " + err.message);
    }
}

async function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const category = document.getElementById('eventCategory').value;
    const desc = document.getElementById('eventDesc').value;
    const date = document.getElementById('eventDate').value;
    const file = document.getElementById('eventImage').files[0];

    if(!title || !desc) return alert("Isi judul dan deskripsi!");

    let imageData = null;
    if(file) {
        imageData = await toBase64(file);
    }

    try {
        await ApiService.addEvent({ title, category, desc, date, image: imageData });
        alert("Kegiatan berhasil ditambahkan!");
        location.reload(); // Reload untuk memperbarui tampilan dashboard jika perlu
    } catch (err) {
        alert("Gagal menambah kegiatan: " + err.message);
    }
}

async function addStaff() {
    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const department = document.getElementById('staffDept').value;
    const file = document.getElementById('staffImage').files[0];

    if(!name || !position) return alert("Isi nama dan jabatan!");

    let imageData = null;
    if(file) imageData = await toBase64(file);

    try {
        await ApiService.addStaff({ name, position, department, image: imageData });
        alert("Pengurus berhasil ditambahkan!");
        location.reload();
    } catch (err) {
        alert("Gagal menambah pengurus: " + err.message);
    }
}

async function addGallery() {
    const file = document.getElementById('galleryImage').files[0];
    const caption = document.getElementById('galleryCaption').value;

    if(!file) return alert("Pilih foto!");

    const imageData = await toBase64(file);
    try {
        await ApiService.addGallery({ image: imageData, caption: caption });
        alert("Foto berhasil ditambahkan ke galeri!");
        location.reload();
    } catch (err) {
        alert("Gagal menambah galeri: " + err.message);
    }
}

async function exportData() {
    const data = {
        about: await ApiService.getAbout(),
        events: await ApiService.getEvents(),
        gallery: await ApiService.getGallery()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_imama_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = JSON.parse(e.target.result);
            await ApiService.bulkImport(data);
            alert("Data berhasil di-import!");
            location.reload();
        } catch (err) {
            alert("File JSON tidak valid!");
        }
    };
    reader.readAsText(file);
}

async function clearAllData() {
    if(confirm("Hapus semua data konten?")) {
        await ApiService.clearData();
        alert("Data dibersihkan.");
        location.reload();
    }
}

// Helper konversi gambar ke string agar bisa disimpan di localStorage
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});