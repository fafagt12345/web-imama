const defaultData = {
  hero: {
    title: 'Membangun Solidaritas Mahasiswa Magetan di Universitas Negeri Surabaya',
    subtitle: 'IMAMA Magetan UNESA hadir untuk memperkuat rasa kekeluargaan, profesionalisme, dan semangat rantau di Surabaya.',
    ctaPrimary: 'Gabung IMAMA',
    ctaSecondary: 'Lihat Kegiatan'
  },
  about: {
    intro: 'IMAMA Magetan UNESA adalah wadah aspirasi dan solidaritas mahasiswa Magetan yang menuntut ilmu di Universitas Negeri Surabaya.',
    history: 'Bermula dari kumpulan mahasiswa rantau Magetan...',
    logo: 'Logo IMAMA merepresentasikan dua sisi...',
    philosophy: 'Filosofi kami adalah "Rantau Terikat, Karya Terbuka"...',
    vision: 'Menjadi organisasi mahasiswa Magetan yang progresif...'
  },
  departments: [
    { name: 'BPH', color: 'from-emerald-500 to-emerald-700', desc: 'Koordinasi strategis.', leader: 'Ahmad Fulan', members: 42, icon: '🛡️' }
  ],
  officers: [],
  news: [],
  gallery: [],
  timeline: [],
  contact: { whatsapp: '', instagram: '', email: '', address: '' },
  stats: []
};

const savedData = localStorage.getItem('imamaSiteData');
const stored = savedData ? JSON.parse(savedData) : defaultData;

function AdminApp() {
  const [auth, setAuth] = React.useState(localStorage.getItem('imamaAdmin') === 'true');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [data, setData] = React.useState(stored);
  const [tab, setTab] = React.useState('hero');

  React.useEffect(() => {
    if (auth) {
      const loadFromDB = async () => {
        setMessage('⏳ Mengambil data terbaru dari Cloud...');
        try {
          const remoteData = await ApiService.exportAll();
          if (remoteData && Object.keys(remoteData).length > 0) {
            const merged = {
              ...defaultData,
              about: { ...defaultData.about, intro: remoteData.about?.[0]?.content || defaultData.about.intro },
              hero: { ...defaultData.hero, title: remoteData.settings?.hero_title || defaultData.hero.title, subtitle: remoteData.settings?.hero_subtitle || defaultData.hero.subtitle },
              news: remoteData.events?.map(e => ({ ...e, desc: e.description, date: e.event_date, image: e.image_data })) || [],
              officers: remoteData.staff?.map(s => ({ ...s, role: s.position, dept: s.department, image: s.image_data })) || [],
              gallery: remoteData.gallery?.map(g => g.image_data) || [],
              timeline: remoteData.timeline || [],
              contact: { ...defaultData.contact, email: remoteData.settings?.email || '', instagram: remoteData.settings?.instagram || '' }
            };
            setData(merged);
            localStorage.setItem('imamaSiteData', JSON.stringify(merged));
            setMessage('✓ Data disinkronkan dari Cloud.');
          }
        } catch (err) {
          setMessage('⚠️ Gagal sinkronisasi otomatis. Menggunakan data lokal.');
        } finally { setTimeout(() => setMessage(''), 3000); }
      };
      loadFromDB();
    }
  }, [auth]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('imamaAdmin', 'true');
        setAuth(true);
        setMessage('✓ Login berhasil');
      } else {
        setMessage('❌ Password salah!');
      }
    } catch (err) {
      setMessage('Gagal terhubung ke server login');
    }
  };

  const saveData = async () => {
    try {
      setMessage('⏳ Menyimpan ke database...');
      const syncData = {
        about: data.about.intro,
        settings: {
          hero_title: data.hero.title,
          hero_subtitle: data.hero.subtitle,
          email: data.contact.email,
          instagram: data.contact.instagram
        },
        events: data.news,
        staff: data.officers,
        gallery: data.gallery,
        timeline: data.timeline
      };
      await ApiService.bulkImport(syncData);
      localStorage.setItem('imamaSiteData', JSON.stringify(data));
      setMessage('✓ Tersimpan di Cloud! Semua perangkat bisa melihat perubahan.');
    } catch (err) {
      setMessage('❌ Gagal menyimpan: ' + err.message);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const addItem = (key) => {
    if (key === 'officers') {
      setData({ ...data, officers: [...data.officers, { name: 'Nama', role: 'Jabatan', major: 'Jurusan', batch: '2024', dept: 'BPH', image: '' }] });
    } else if (key === 'news') {
      setData({ ...data, news: [...data.news, { title: 'Berita Baru', date: '2025-01-01', category: 'Event', image: '' }] });
    } else if (key === 'gallery') {
      setData({ ...data, gallery: [...data.gallery, ''] });
    }
  };

  const deleteItem = (key, idx) => {
    const updated = [...data[key]];
    updated.splice(idx, 1);
    setData({ ...data, [key]: updated });
  };

  const updateItem = (key, idx, field, value) => {
    const updated = [...data[key]];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, [key]: updated });
  };

  const handleImageUpload = (e, key, idx, field) => {
    const file = e.target.files[0];
    if (file && file.size > 1048576) {
      alert('⚠️ Foto terlalu besar (max 1MB)');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        if (key === 'gallery') {
          const updated = [...data.gallery];
          updated[idx] = base64;
          setData({ ...data, gallery: updated });
        } else {
          updateItem(key, idx, field, base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-emerald-600 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">IMAMA Admin</h1>
          <p className="text-center text-slate-600 mb-8">Masukkan password untuk mengedit</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 mb-4" placeholder="Password" />
          <button onClick={handleLogin} className="w-full rounded-full bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition">Login</button>
          {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: '🎯 Hero' },
    { id: 'about', label: '📖 Tentang' },
    { id: 'officers', label: '👔 Pengurus' },
    { id: 'news', label: '📰 Kegiatan' },
    { id: 'gallery', label: '📸 Galeri' },
    { id: 'contact', label: '📞 Kontak' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">IMAMA Dashboard</h1>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm">Lihat Situs</a>
            <button onClick={() => { localStorage.removeItem('imamaAdmin'); setAuth(false); }} className="px-4 py-2 rounded-full bg-slate-200 text-slate-700 text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 border border-slate-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {message && <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-2xl text-sm">{message}</div>}

        <div className="space-y-4 pb-24">
          {tab === 'hero' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div><label className="text-sm font-semibold block mb-2">Judul Hero</label><input type="text" value={data.hero.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" /></div>
              <div><label className="text-sm font-semibold block mb-2">Subjudul Hero</label><textarea value={data.hero.subtitle} onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="3"></textarea></div>
            </div>
          )}

          {tab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <label className="text-sm font-semibold block mb-2">Teks Tentang Kami</label>
              <textarea value={data.about.intro} onChange={e => setData({...data, about: {...data.about, intro: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="6"></textarea>
            </div>
          )}

          {tab === 'officers' && (
            <>
              {data.officers.map((officer, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 grid gap-3">
                  <div className="flex justify-between font-bold"><span>Pengurus {idx + 1}</span><button onClick={() => deleteItem('officers', idx)} className="text-red-600">Hapus</button></div>
                  <input type="text" value={officer.name} onChange={e => updateItem('officers', idx, 'name', e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded-lg p-2" />
                  <input type="text" value={officer.role} onChange={e => updateItem('officers', idx, 'role', e.target.value)} placeholder="Jabatan" className="w-full border rounded-lg p-2" />
                  <div className="flex gap-2 items-center">
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'officers', idx, 'image')} className="text-xs" />
                    {officer.image && <span className="text-emerald-600 text-xs">✓ Foto ada</span>}
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('officers')} className="w-full bg-emerald-600 text-white py-3 rounded-xl">+ Tambah Pengurus</button>
            </>
          )}

          {tab === 'news' && (
            <>
              {data.news.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 grid gap-3">
                  <div className="flex justify-between font-bold"><span>Kegiatan {idx + 1}</span><button onClick={() => deleteItem('news', idx)} className="text-red-600">Hapus</button></div>
                  <input type="text" value={item.title} onChange={e => updateItem('news', idx, 'title', e.target.value)} placeholder="Judul Kegiatan" className="w-full border rounded-lg p-2" />
                  <textarea value={item.desc} onChange={e => updateItem('news', idx, 'desc', e.target.value)} placeholder="Deskripsi Singkat" className="w-full border rounded-lg p-2"></textarea>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'news', idx, 'image')} />
                </div>
              ))}
              <button onClick={() => addItem('news')} className="w-full bg-emerald-600 text-white py-3 rounded-xl">+ Tambah Kegiatan</button>
            </>
          )}

          {tab === 'gallery' && (
            <div className="grid grid-cols-2 gap-4">
              {data.gallery.map((img, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between mb-2"><span className="text-xs">Foto {idx + 1}</span><button onClick={() => deleteItem('gallery', idx)} className="text-red-600 text-xs">Hapus</button></div>
                  {img ? <img src={img} className="h-32 w-full object-cover rounded-lg mb-2" /> : <div className="h-32 bg-slate-100 rounded-lg mb-2 flex items-center justify-center text-xs">Belum ada foto</div>}
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'gallery', idx)} className="text-[10px]" />
                </div>
              ))}
              <button onClick={() => addItem('gallery')} className="h-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl py-12 text-slate-500 font-bold">+ Foto</button>
            </div>
          )}

          {tab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div><label className="text-sm font-semibold block mb-2">WhatsApp</label><input type="text" value={data.contact.whatsapp} onChange={e => setData({...data, contact: {...data.contact, whatsapp: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" /></div>
              <div><label className="text-sm font-semibold block mb-2">Email</label><input type="text" value={data.contact.email} onChange={e => setData({...data, contact: {...data.contact, email: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" /></div>
              <div><label className="text-sm font-semibold block mb-2">Instagram Username (tanpa @)</label><input type="text" value={data.contact.instagram} onChange={e => setData({...data, contact: {...data.contact, instagram: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2" /></div>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6 flex gap-3">
          <button onClick={saveData} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold shadow-2xl hover:scale-105 transition">✓ Simpan ke Cloud</button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
    };
    reader.readAsText(file);
}

async function clearAllData() {
    if(confirm("Hapus semua data konten?")) {
