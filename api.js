/**
 * ApiService untuk koneksi ke MySQL Backend.
 */

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';

const ApiService = {
    async getAbout() {
        const res = await fetch(`${API_URL}/about`);
        return res.json();
    },
    async getSettings() {
        const res = await fetch(`${API_URL}/settings`);
        return res.json();
    },
    async updateSettings(settings) {
        await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return { success: true };
    },
    async getHeroSlides() {
        const res = await fetch(`${API_URL}/hero`);
        return res.json();
    },
    async addHeroSlide(image) {
        await fetch(`${API_URL}/hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image })
        });
        return { success: true };
    },
    async getEvents() {
        const res = await fetch(`${API_URL}/events`);
        return res.json();
    },
    async addEvent(eventData) {
        await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        return { success: true };
    },
    async getGallery() {
        const res = await fetch(`${API_URL}/gallery`);
        return res.json();
    },
    async addGallery(galleryData) {
        await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(galleryData)
        });
        return { success: true };
    },
    async getStaff() {
        const res = await fetch(`${API_URL}/staff`);
        return res.json();
    },
    async addStaff(staffData) {
        await fetch(`${API_URL}/staff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffData)
        });
        return { success: true };
    },
    async exportAll() {
        const res = await fetch(`${API_URL}/export-all`);
        return res.json();
    },
    async bulkImport(data) {
        await fetch(`${API_URL}/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return { success: true };
    },
    async clearData() {
        await fetch(`${API_URL}/clear-data`, { method: 'POST' });
        return { success: true };
    }
};
