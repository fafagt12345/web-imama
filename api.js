/**
 * ApiService untuk koneksi ke MySQL Backend.
 */

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';

const ApiService = {
    async login(password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return res.json();
    },
    async exportAll() {
        const res = await fetch(`${API_URL}/export-all`);
        return res.json();
    },
    async bulkImport(data) {
        const res = await fetch(`${API_URL}/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
