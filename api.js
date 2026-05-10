/**
 * ApiService - Using localStorage only (no server needed)
 */

const ApiService = {
    async login(password) {
        // Simple password check
        const adminPass = localStorage.getItem('adminPassword') || 'imama123';
        if (password === adminPass) {
            return { success: true, message: 'Login berhasil' };
        }
        throw new Error('Password salah');
    },
    async exportAll() {
        // Get data from localStorage
        const data = localStorage.getItem('imamaSiteData');
        if (!data) {
            return {
                about: { intro: '', history: '', logo: '', philosophy: '', vision: '' },
                settings: {},
                hero_slides: [],
                events: [],
                gallery: [],
                staff: [],
                timeline: []
            };
        }
        return JSON.parse(data);
    },
    async bulkImport(data) {
        // Save data to localStorage
        localStorage.setItem('imamaSiteData', JSON.stringify(data));
        return { success: true, message: '✓ Data tersimpan. Halaman lain akan update otomatis dalam 5 detik.' };
    }
};
