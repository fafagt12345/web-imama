        }
        return await response.json();
    },

    async bulkImport(data) {
        const password = localStorage.getItem('imamaAdmin');
        if (!password) {
            throw new Error('Tidak ada sesi login. Silakan login kembali.');
        }
        
        const payload = { password, data };

        const response = await fetch('/api/bulk-import', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal menyimpan data');
        return result;
    }
};