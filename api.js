/**
 * ApiService statis untuk website IMAMA UNESA.
 * Tujuan: membuat halaman berjalan normal tanpa backend saat deploy di Vercel.
 */

const staticData = {
    settings: {
        email: 'imama.unesa@example.com',
        instagram: 'imama_unesa',
        hero_title: 'IMAMA UNESA',
        hero_subtitle: 'Ikatan Mahasiswa Manajemen Akuntansi\nUniversitas Negeri Surabaya'
    },
    about: 'IMAMA UNESA adalah organisasi mahasiswa Program Studi Manajemen Akuntansi di Universitas Negeri Surabaya. Kami aktif menyelenggarakan kegiatan akademik dan non-akademik untuk mendukung perkembangan mahasiswa dan membangun jejaring profesional.',
    heroSlides: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
    ],
    events: [
        {
            id: 1,
            title: 'Pelatihan Public Speaking',
            category: 'Kegiatan',
            desc: 'Pelatihan public speaking untuk meningkatkan kemampuan presentasi dan komunikasi efektif bagi anggota IMAMA UNESA.',
            date: '2025-04-12',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'Workshop Akuntansi Digital',
            category: 'Seminar',
            desc: 'Workshop praktik akuntansi modern dengan software akuntansi untuk mempersiapkan mahasiswa menghadapi dunia kerja.',
            date: '2025-06-03',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
        }
    ],
    gallery: [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80',
            caption: 'Kegiatan bersama IMAMA'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
            caption: 'Seminar dan workshop'
        }
    ],
    staff: [
        { id: 1, name: 'Nadia Hapsari', position: 'Ketua Umum', department: 'BPH', image_data: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
        { id: 2, name: 'Rian Pratama', position: 'Bendahara', department: 'BPH', image_data: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' },
        { id: 3, name: 'Siti Anisa', position: 'Koordinator Infokom', department: 'INFOKOM', image_data: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80' }
    ]
};

const ApiService = {
    async getAbout() {
        return Promise.resolve(staticData.about);
    },

    async getSettings() {
        return Promise.resolve(staticData.settings);
    },

    async updateSettings(settings) {
        Object.assign(staticData.settings, settings);
        return Promise.resolve({ success: true });
    },

    async getHeroSlides() {
        return Promise.resolve(staticData.heroSlides.map(image => ({ image_data: image })));
    },

    async addHeroSlide(image) {
        staticData.heroSlides.unshift(image);
        return Promise.resolve({ success: true });
    },

    async deleteHeroSlide(id) {
        return Promise.resolve({ success: true });
    },

    async updateAbout(text) {
        staticData.about = text;
        return Promise.resolve({ success: true });
    },

    async getEvents() {
        return Promise.resolve(staticData.events);
    },

    async addEvent(eventData) {
        staticData.events.unshift({ id: Date.now(), ...eventData });
        return Promise.resolve({ success: true });
    },

    async deleteEvent(id) {
        staticData.events = staticData.events.filter(e => e.id !== id);
        return Promise.resolve({ success: true });
    },

    async getGallery() {
        return Promise.resolve(staticData.gallery);
    },

    async addGallery(galleryData) {
        staticData.gallery.unshift({ id: Date.now(), ...galleryData });
        return Promise.resolve({ success: true });
    },

    async deleteGallery(id) {
        staticData.gallery = staticData.gallery.filter(g => g.id !== id);
        return Promise.resolve({ success: true });
    },

    async getStaff() {
        return Promise.resolve(staticData.staff);
    },

    async addStaff(staffData) {
        staticData.staff.push({ id: Date.now(), ...staffData });
        return Promise.resolve({ success: true });
    },

    async deleteStaff(id) {
        staticData.staff = staticData.staff.filter(s => s.id !== id);
        return Promise.resolve({ success: true });
    },

    async bulkImport(data) {
        return Promise.resolve({ success: true });
    },

    async clearData() {
        return Promise.resolve({ success: true });
    }
};
