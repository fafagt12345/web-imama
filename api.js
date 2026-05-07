/**
 * API Service Provider
 * Sekarang terhubung ke Backend Server (MySQL).
 */

// Menggunakan path relatif agar otomatis menyesuaikan dengan domain tempat web di-deploy
// Di lokal akan ke localhost:3000/api, di Vercel akan ke domain-anda.com/api
const API_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

const ApiService = {
    // Mengambil data "Tentang Kami"
    async getAbout() {
        const res = await fetch(`${API_URL}/about`);
        return res.json();
    },

    // Mengambil pengaturan website
    async getSettings() {
        const res = await fetch(`${API_URL}/settings`);
        return res.json();
    },

    // Update pengaturan
    async updateSettings(settings) {
        const res = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return res.json();
    },

    // Hero Slides Management
    async getHeroSlides() {
        const res = await fetch(`${API_URL}/hero`);
        return res.json();
    },

    async addHeroSlide(image) {
        const res = await fetch(`${API_URL}/hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image })
        });
        return res.json();
    },

    async deleteHeroSlide(id) {
        await fetch(`${API_URL}/hero/${id}`, { method: 'DELETE' });
    },

    // Menyimpan data "Tentang Kami"
    async updateAbout(text) {
        const res = await fetch(`${API_URL}/about`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text })
        });
        return res.json();
    },

    // Mengambil semua kegiatan
    async getEvents() {
        const res = await fetch(`${API_URL}/events`);
        return res.json();
    },

    // Menambah kegiatan baru
    async addEvent(eventData) {
        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        return res.json();
    },

    // Menghapus kegiatan
    async deleteEvent(id) {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // Mengambil semua galeri
    async getGallery() {
        const res = await fetch(`${API_URL}/gallery`);
        return res.json();
    },

    // Menambah foto galeri
    async addGallery(galleryData) {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(galleryData)
        });
        return res.json();
    },

    // Menghapus galeri
    async deleteGallery(id) {
        const res = await fetch(`${API_URL}/gallery/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // Staff Management
    async getStaff() {
        const res = await fetch(`${API_URL}/staff`);
        return res.json();
    },

    async addStaff(staffData) {
        const res = await fetch(`${API_URL}/staff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffData)
        });
        return res.json();
    },

    async deleteStaff(id) {
        await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' });
    },

    // Fungsi pembantu untuk import massal (digunakan oleh admin.js)
    async bulkImport(data) {
        const res = await fetch(`${API_URL}/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // Reset data
    async clearData() {
        const res = await fetch(`${API_URL}/clear-data`, { method: 'POST' });
        return res.json();
    }
};