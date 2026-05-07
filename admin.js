    const desc = document.getElementById('eventDesc').value;
    const date = document.getElementById('eventDate').value;
    const file = document.getElementById('eventImage').files[0];

    if(!title || !desc) return alert("Isi judul dan deskripsi!");

    let imageData = null;
    if(file) {
        imageData = await toBase64(file);
    }
    
    // Tampilkan loading agar admin tahu proses sedang berjalan
    const btn = document.activeElement;
    const originalText = btn.innerText;
    btn.innerText = "⏳ Menyimpan...";
    btn.disabled = true;

    try {
        await ApiService.addEvent({ title, category, desc, date, image: imageData });
        alert("Kegiatan berhasil ditambahkan!");
        location.reload(); // Reload untuk memperbarui tampilan dashboard jika perlu
    } catch (err) {
        alert("Gagal menambah kegiatan: " + err.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

...

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