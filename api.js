/**
 * API Service Provider
 * Sekarang terhubung ke Backend Server (MySQL).
 */

// Menggunakan path relatif agar otomatis menyesuaikan dengan domain tempat web di-deploy
// Di lokal akan ke localhost:3000/api, di Vercel akan ke domain-anda.com/api
const API_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

/**
 * Helper untuk menangani request fetch agar lebih bersih
 */
async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Terjadi kesalahan server' }));
        throw new Error(error.message || 'Gagal mengambil data');
    }
    return res.json();
}

const ApiService = {
    // Mengambil data "Tentang Kami"
    async getAbout() {
        return request('/about');
    },

    // Mengambil pengaturan website
    async getSettings() {
        return request('/settings');
    },

    // Update pengaturan
    async updateSettings(settings) {
        return request('/settings', { method: 'POST', body: JSON.stringify(settings) });
    },

    // Hero Slides Management
    async getHeroSlides() {
        return request('/hero');
    },

    async addHeroSlide(image) {
        return request('/hero', { method: 'POST', body: JSON.stringify({ image }) });
    },

    async deleteHeroSlide(id) {
        return request(`/hero/${id}`, { method: 'DELETE' });
    },

    async updateAbout(text) {
        return request('/about', { method: 'POST', body: JSON.stringify({ content: text }) });
    },

    async getEvents() {
        return request('/events');
    },

    async addEvent(eventData) {
        return request('/events', { method: 'POST', body: JSON.stringify(eventData) });
    },

    async deleteEvent(id) {
        return request(`/events/${id}`, { method: 'DELETE' });
    },

    async getGallery() {
        return request('/gallery');
    },

    async addGallery(galleryData) {
        return request('/gallery', { method: 'POST', body: JSON.stringify(galleryData) });
    },

    async deleteGallery(id) {
        return request(`/gallery/${id}`, { method: 'DELETE' });
    },

    async getStaff() {
        return request('/staff');
    },

    async addStaff(staffData) {
        return request('/staff', { method: 'POST', body: JSON.stringify(staffData) });
    },

    async deleteStaff(id) {
        return request(`/staff/${id}`, { method: 'DELETE' });
    },

    async bulkImport(data) {
        return request('/bulk-import', { method: 'POST', body: JSON.stringify(data) });
    },

    async clearData() {
        return request('/clear-data', { method: 'POST' });
    }
};