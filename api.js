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
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || data.error || 'Login gagal');
        }
        return data;
    },
    async exportAll() {
        const res = await fetch(`${API_URL}/export-all`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
            throw new Error(data.error || 'Gagal memuat data server');
        }
        return data;
    },
    async bulkImport(data) {
        const res = await fetch(`${API_URL}/bulk-import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok || result.success === false) {
            throw new Error(result.error || 'Gagal menyimpan data ke server');
        }
        return result;
    }
};
