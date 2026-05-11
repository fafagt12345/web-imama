const ApiService = {
    async login(password) {
        const response = await fetch('/api/bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: password,
                action: 'login'
            })
        });
        const result = await response.json();
        if (result.success) return result;
        throw new Error(result.message || 'Login gagal');
    },

    async exportAll() {
        const response = await fetch('/api/export-all');
        if (!response.ok) {
            // Coba parse pesan error dari body jika response tidak OK
            const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorBody.error || 'Gagal mengambil data dari server');
        }
        return await response.json();
    },

    async bulkImport(data) {
        const password = localStorage.getItem('imamaAdmin');
        if (!password) {
            throw new Error('Tidak ada sesi login. Silakan login kembali.');
        }
        const response = await fetch('/api/bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: password,
                data: data
            })
        });
        const result = await response.json();
        if (result.success) return result;
        throw new Error(result.message || 'Gagal menyimpan data');
    }
};
