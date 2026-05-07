const STORAGE_KEY = 'imamaSiteData';
const AUTH_KEY = 'imamaAdmin';

const defaultData = {
  hero: {
    title: 'Membangun Solidaritas Mahasiswa Magetan di Universitas Negeri Surabaya',
    subtitle: 'IMAMA Magetan UNESA hadir untuk memperkuat rasa kekeluargaan, profesionalisme, dan semangat rantau di Surabaya.',
    ctaPrimary: 'Gabung IMAMA',
    ctaSecondary: 'Lihat Kegiatan'
  },
  about: {
    intro: 'IMAMA Magetan UNESA adalah wadah aspirasi dan solidaritas mahasiswa Magetan yang menuntut ilmu di Universitas Negeri Surabaya. Kami bergerak dalam kegiatan pengembangan organisasi, sosial, akademik, dan budaya rantau.',
    history: 'Bermula dari kumpulan mahasiswa rantau Magetan yang ingin menyatukan tekad dan budaya, IMAMA lahir sebagai identitas kebersamaan untuk berbagi kekuatan selama studi.',
    logo: 'Logo IMAMA merepresentasikan dua sisi: akar Magetan yang kuat dan ruang gerak inovasi di dunia kampus.',
    philosophy: 'Filosofi kami adalah “Rantau Terikat, Karya Terbuka” — menjaga nilai keluarga asal, sambil berkembang bersama dalam kebersamaan akademik.',
    vision: 'Menjadi organisasi mahasiswa Magetan yang progresif, aktif, dan menjadi inspirasi solidaritas rantau di lingkungan kampus.'
  },
  departments: [
    { name: 'BPH', color: 'from-emerald-500 to-emerald-700', desc: 'Koordinasi strategis dan penguatan organisasi.', leader: 'Ahmad Fulan', members: 42, icon: '🛡️' },
    { name: 'DPM', color: 'from-slate-500 to-slate-700', desc: 'Pengawasan dan kebijakan internal.', leader: 'Nadia Hapsari', members: 18, icon: '📜' },
    { name: 'DBM', color: 'from-amber-400 to-amber-600', desc: 'Keuangan organisasi dan pendanaan kegiatan.', leader: 'Rian Pratama', members: 16, icon: '💰' },
    { name: 'DPO', color: 'from-cyan-500 to-cyan-700', desc: 'Pengabdian masyarakat dan event sosial.', leader: 'Siti Anisa', members: 24, icon: '🤝' },
    { name: 'EKRAF', color: 'from-pink-500 to-pink-700', desc: 'Kegiatan kreatif dan seni budaya.', leader: 'Lina Kartika', members: 20, icon: '🎨' },
    { name: 'INFOKOM', color: 'from-violet-500 to-violet-700', desc: 'Komunikasi digital dan dokumentasi.', leader: 'Dio Prasetyo', members: 26, icon: '💡' },
    { name: 'KORWIL', color: 'from-emerald-300 to-emerald-500', desc: 'Koordinasi wilayah dan jaringan rantau.', leader: 'Maya Lestari', members: 30, icon: '🌍' }
  ],
  officers: [
    { name: 'Ahmad Fulan', role: 'Ketua Umum', major: 'Teknik Informatika', batch: '2024', dept: 'BPH', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=600&q=80' },
    { name: 'Nadia Hapsari', role: 'Sekretaris', major: 'Manajemen', batch: '2024', dept: 'DPM', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rian Pratama', role: 'Bendahara', major: 'Akuntansi', batch: '2024', dept: 'DBM', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' }
  ],
  news: [
    { title: 'Pelatihan Kepemimpinan Rantau', date: 'Mei 2025', category: 'Program Kerja', desc: 'Kegiatan berbagi kepemimpinan bagi anggota baru dan lama.', image: 'https://images.unsplash.com/photo-1515162305289-2c51f1d9e5f2?auto=format&fit=crop&w=800&q=80' },
    { title: 'Festival Kebudayaan Magetan', date: 'Juni 2025', category: 'Event', desc: 'Festival budaya dan seni sebagai wujud kebersamaan rantau.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80'
  ],
  timeline: [
    { year: '2020', event: 'IMAMA berdiri sebagai organisasi mahasiswa rantau Magetan di UNESA.' },
    { year: '2022', event: 'Pelantikan kepengurusan dan perluasan program bakti sosial.' },
    { year: '2024', event: 'Pencapaian membership 200+ dan penguatan visi baru.' }
  ],
  contact: {
    whatsapp: '+6281234567890',
    instagram: 'imama.magetan',
    email: 'admin@imamaunesa.org',
    address: 'Sekretariat IMAMA UNESA, Surabaya'
  },
  stats: [
    { label: 'Anggota Aktif', value: '200+' },
    { label: 'Departemen', value: '7' },
    { label: 'Kegiatan', value: '35' },
    { label: 'Alumni', value: '150+' }
  ]
};

function loadLocalData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      about: { ...defaultData.about, ...parsed.about },
      hero: { ...defaultData.hero, ...parsed.hero },
      contact: { ...defaultData.contact, ...parsed.contact },
      departments: parsed.departments || defaultData.departments,
      officers: parsed.officers || defaultData.officers,
      news: parsed.news || defaultData.news,
      gallery: parsed.gallery || defaultData.gallery,
      timeline: parsed.timeline || defaultData.timeline,
      stats: parsed.stats || defaultData.stats
    };
  } catch (err) {
    console.warn('Local data invalid, using defaults', err);
    return defaultData;
  }
}

function saveLocalData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toRemotePayload(data) {
  return {
    about: {
      intro: data.about.intro,
      history: data.about.history,
      logo: data.about.logo,
      philosophy: data.about.philosophy,
      vision: data.about.vision
    },
    settings: {
      hero_title: data.hero.title,
      hero_subtitle: data.hero.subtitle,
      email: data.contact.email,
      instagram: data.contact.instagram,
      whatsapp: data.contact.whatsapp,
      address: data.contact.address
    },
    events: data.news.map(item => ({
      title: item.title,
      category: item.category,
      description: item.desc,
      event_date: item.date,
      image_data: item.image
    })),
    staff: data.officers.map(officer => ({
      name: officer.name,
      position: officer.role,
      department: officer.dept,
      major: officer.major || '',
      batch: officer.batch || '',
      image_data: officer.image
    })),
    gallery: data.gallery.map(image => ({ image_data: image, caption: '' })),
    timeline: data.timeline
  };
}

function fromRemoteData(raw) {
  if (!raw) return defaultData;
  const aboutData = Array.isArray(raw.about) ? raw.about[0] : raw.about || {};
  return {
    ...defaultData,
    about: {
      ...defaultData.about,
      intro: aboutData.intro || aboutData.content || defaultData.about.intro,
      history: aboutData.history || defaultData.about.history,
      logo: aboutData.logo || defaultData.about.logo,
      philosophy: aboutData.philosophy || defaultData.about.philosophy,
      vision: aboutData.vision || defaultData.about.vision
    },
    hero: {
      ...defaultData.hero,
      title: raw.settings?.hero_title || defaultData.hero.title,
      subtitle: raw.settings?.hero_subtitle || defaultData.hero.subtitle
    },
    contact: {
      ...defaultData.contact,
      email: raw.settings?.email || defaultData.contact.email,
      instagram: raw.settings?.instagram || defaultData.contact.instagram,
      whatsapp: raw.settings?.whatsapp || defaultData.contact.whatsapp,
      address: raw.settings?.address || defaultData.contact.address
    },
    news: raw.events?.map(e => ({ title: e.title, date: e.event_date, category: e.category, desc: e.description, image: e.image_data })) || defaultData.news,
    gallery: raw.gallery?.map(g => g.image_data) || defaultData.gallery,
    officers: raw.staff?.map(s => ({
      name: s.name,
      role: s.position,
      dept: s.department,
      major: s.major || '',
      batch: s.batch || '',
      image: s.image_data
    })) || defaultData.officers,
    timeline: raw.timeline || defaultData.timeline
  };
}

function AdminApp() {
  const [auth, setAuth] = React.useState(localStorage.getItem(AUTH_KEY) === 'true');
  const [password, setPassword] = React.useState('');
  const [data, setData] = React.useState(loadLocalData());
  const [tab, setTab] = React.useState('hero');
  const [message, setMessage] = React.useState('');
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (auth) {
      const fetchRemote = async () => {
        setMessage('⏳ Memuat data dari server...');
        try {
          const remote = await ApiService.exportAll();
          const merged = fromRemoteData(remote);
          setData(merged);
          saveLocalData(merged);
          setMessage('✓ Data berhasil diambil dari server.');
        } catch (error) {
          console.warn('Remote data fetch failed, using local', error);
          setMessage('⚠️ Tidak bisa mengambil data server. Menggunakan data lokal.');
        }
        setTimeout(() => setMessage(''), 4000);
      };
      fetchRemote();
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
        localStorage.setItem(AUTH_KEY, 'true');
        setAuth(true);
        setMessage('✓ Login berhasil. Menyinkronkan data server...');
      } else {
        setMessage('❌ Password salah.');
      }
    } catch (error) {
      setMessage('⚠️ Gagal terhubung ke server login.');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSave = async () => {
    const payload = toRemotePayload(data);
    try {
      setMessage('⏳ Menyimpan ke server...');
      await ApiService.bulkImport(payload);
      saveLocalData(data);
      setMessage('✓ Data tersimpan di server. Perangkat lain akan melihat perubahan setelah refresh.');
    } catch (error) {
      console.error('Save failed', error);
      saveLocalData(data);
      setMessage('❌ Gagal menyimpan ke server. Data tersimpan lokal.');
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imama-site-data-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const imported = JSON.parse(loadEvent.target.result);
        const merged = {
          ...defaultData,
          ...imported,
          about: { ...defaultData.about, ...imported.about },
          hero: { ...defaultData.hero, ...imported.hero },
          contact: { ...defaultData.contact, ...imported.contact },
          departments: imported.departments || defaultData.departments,
          officers: imported.officers || defaultData.officers,
          news: imported.news || defaultData.news,
          gallery: imported.gallery || defaultData.gallery,
          timeline: imported.timeline || defaultData.timeline,
          stats: imported.stats || defaultData.stats
        };
        setData(merged);
        saveLocalData(merged);
        setMessage('✓ Data berhasil diimpor dan tersimpan lokal.');
      } catch (error) {
        setMessage('❌ File JSON tidak valid.');
      }
      event.target.value = '';
      setTimeout(() => setMessage(''), 5000);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e, key, idx, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1048576) {
      alert('⚠️ Foto terlalu besar (max 1MB)');
      return;
    }
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
  };

  const addItem = (key) => {
    if (key === 'officers') {
      setData({ ...data, officers: [...data.officers, { name: 'Nama Pengurus', role: 'Jabatan', major: 'Jurusan', batch: '2025', dept: 'BPH', image: '' }] });
    } else if (key === 'news') {
      setData({ ...data, news: [...data.news, { title: 'Judul Berita', date: '2025-01-01', category: 'Kegiatan', desc: 'Deskripsi singkat', image: '' }] });
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

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(false);
    setPassword('');
    setMessage('✓ Logout berhasil');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-emerald-600 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">IMAMA Admin</h1>
          <p className="text-center text-slate-600 mb-8">Masukkan password untuk mengedit</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 mb-4"
            placeholder="Password"
          />
          <button onClick={handleLogin} className="w-full rounded-full bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition">Login</button>
          {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
          <p className="mt-6 text-sm text-slate-500">Password default: <strong>imama123</strong></p>
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">IMAMA Dashboard</h1>
            <p className="text-sm text-slate-500">Edit data situs dan simpan ke server untuk sinkron antar perangkat.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExport} className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm">⬇️ Export JSON</button>
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 rounded-full border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">⬆️ Import JSON</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm">✓ Simpan ke Server</button>
            <button onClick={logout} className="px-4 py-2 rounded-full bg-slate-200 text-slate-700 text-sm">Logout</button>
          </div>
        </div>
      </header>

      <input type="file" accept="application/json" ref={fileInputRef} className="hidden" onChange={handleImportFile} />

      <div className="max-w-7xl mx-auto p-6">
        {message && <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-2xl text-sm">{message}</div>}
        <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 border border-slate-200">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 pb-24">
          {tab === 'hero' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Judul Hero</label>
                <input type="text" value={data.hero.title} onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Subjudul Hero</label>
                <textarea value={data.hero.subtitle} onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="4"></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Teks Tombol CTA Utama</label>
                <input type="text" value={data.hero.ctaPrimary} onChange={e => setData({ ...data, hero: { ...data.hero, ctaPrimary: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Teks Tombol CTA Kedua</label>
                <input type="text" value={data.hero.ctaSecondary} onChange={e => setData({ ...data, hero: { ...data.hero, ctaSecondary: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Teks Tentang Kami</label>
                <textarea value={data.about.intro} onChange={e => setData({ ...data, about: { ...data.about, intro: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="6"></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Sejarah</label>
                <textarea value={data.about.history} onChange={e => setData({ ...data, about: { ...data.about, history: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="4"></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Makna Logo</label>
                <textarea value={data.about.logo} onChange={e => setData({ ...data, about: { ...data.about, logo: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="4"></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Filosofi</label>
                <textarea value={data.about.philosophy} onChange={e => setData({ ...data, about: { ...data.about, philosophy: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="4"></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Visi</label>
                <textarea value={data.about.vision} onChange={e => setData({ ...data, about: { ...data.about, vision: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="4"></textarea>
              </div>
            </div>
          )}

          {tab === 'officers' && (
            <>
              {data.officers.map((officer, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <h2 className="font-semibold">Pengurus {idx + 1}</h2>
                    <button onClick={() => deleteItem('officers', idx)} className="text-red-600 text-sm">Hapus</button>
                  </div>
                  <input type="text" value={officer.name} onChange={e => updateItem('officers', idx, 'name', e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded-xl p-3" />
                  <input type="text" value={officer.role} onChange={e => updateItem('officers', idx, 'role', e.target.value)} placeholder="Jabatan" className="w-full border rounded-xl p-3" />
                  <input type="text" value={officer.major} onChange={e => updateItem('officers', idx, 'major', e.target.value)} placeholder="Program Studi" className="w-full border rounded-xl p-3" />
                  <input type="text" value={officer.batch} onChange={e => updateItem('officers', idx, 'batch', e.target.value)} placeholder="Angkatan" className="w-full border rounded-xl p-3" />
                  <input type="text" value={officer.dept} onChange={e => updateItem('officers', idx, 'dept', e.target.value)} placeholder="Departemen" className="w-full border rounded-xl p-3" />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Foto Pengurus</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'officers', idx, 'image')} className="text-sm" />
                    {officer.image && <span className="text-emerald-600 text-sm">✓ Foto sudah ada</span>}
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('officers')} className="w-full bg-emerald-600 text-white py-3 rounded-xl">+ Tambah Pengurus</button>
            </>
          )}

          {tab === 'news' && (
            <>
              {data.news.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <h2 className="font-semibold">Kegiatan {idx + 1}</h2>
                    <button onClick={() => deleteItem('news', idx)} className="text-red-600 text-sm">Hapus</button>
                  </div>
                  <input type="text" value={item.title} onChange={e => updateItem('news', idx, 'title', e.target.value)} placeholder="Judul Kegiatan" className="w-full border rounded-xl p-3" />
                  <textarea value={item.desc} onChange={e => updateItem('news', idx, 'desc', e.target.value)} placeholder="Deskripsi singkat" className="w-full border rounded-xl p-3" rows="4"></textarea>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input type="text" value={item.category} onChange={e => updateItem('news', idx, 'category', e.target.value)} placeholder="Kategori" className="w-full border rounded-xl p-3" />
                    <input type="date" value={item.date} onChange={e => updateItem('news', idx, 'date', e.target.value)} className="w-full border rounded-xl p-3" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Foto Kegiatan</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'news', idx, 'image')} className="text-sm" />
                    {item.image && <span className="text-emerald-600 text-sm">✓ Foto sudah ada</span>}
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('news')} className="w-full bg-emerald-600 text-white py-3 rounded-xl">+ Tambah Kegiatan</button>
            </>
          )}

          {tab === 'gallery' && (
            <div className="grid gap-4 md:grid-cols-2">
              {data.gallery.map((img, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold">Foto {idx + 1}</span>
                    <button onClick={() => deleteItem('gallery', idx)} className="text-red-600 text-sm">Hapus</button>
                  </div>
                  {img ? <img src={img} className="h-40 w-full object-cover rounded-xl mb-3" alt="Gallery" /> : <div className="h-40 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-400">Belum ada foto</div>}
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'gallery', idx)} className="text-sm" />
                </div>
              ))}
              <button onClick={() => addItem('gallery')} className="h-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500 font-semibold">+ Tambah Foto</button>
            </div>
          )}

          {tab === 'contact' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">WhatsApp</label>
                <input type="text" value={data.contact.whatsapp} onChange={e => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Email</label>
                <input type="text" value={data.contact.email} onChange={e => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Instagram Username (tanpa @)</label>
                <input type="text" value={data.contact.instagram} onChange={e => setData({ ...data, contact: { ...data.contact, instagram: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Alamat</label>
                <textarea value={data.contact.address} onChange={e => setData({ ...data, contact: { ...data.contact, address: e.target.value } })} className="w-full rounded-xl border border-slate-200 px-4 py-2" rows="3"></textarea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
