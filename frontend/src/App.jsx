import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import SiswaTable from './components/SiswaTable.jsx';
import SiswaForm from './components/SiswaForm.jsx';

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formAwal, setFormAwal] = useState(null); // null = tertutup, {} = tambah, objek = ubah
  const [pesan, setPesan] = useState('');
  const [tema, setTema] = useState(() => localStorage.getItem('ruang-siswa-theme') || 'light');
  const [hapusTarget, setHapusTarget] = useState(null);
  const [hapusError, setHapusError] = useState('');
  const [menghapus, setMenghapus] = useState(false);
  const batalHapusRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('ruang-siswa-theme', tema);
  }, [tema]);

  useEffect(() => {
    if (!hapusTarget) return undefined;
    batalHapusRef.current?.focus();
    function tanganiTombol(e) {
      if (e.key === 'Escape' && !menghapus) setHapusTarget(null);
    }
    document.addEventListener('keydown', tanganiTombol);
    return () => document.removeEventListener('keydown', tanganiTombol);
  }, [hapusTarget, menghapus]);

  async function muat(kata = q) {
    try {
      setError('');
      setSiswa(await api.list(kata));
    } catch (e) {
      setError('Gagal memuat data. Pastikan server backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  }

  // Muat ulang saat kata kunci berubah (dengan jeda singkat)
  useEffect(() => {
    const t = setTimeout(() => muat(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(''), 2500);
  }

  async function simpan(data) {
    if (formAwal?.id) {
      await api.update(formAwal.id, data);
      tampilkanPesan('Data siswa disimpan.');
    } else {
      await api.create(data);
      tampilkanPesan('Siswa ditambahkan.');
    }
    setFormAwal(null);
    muat();
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;
    setMenghapus(true);
    setHapusError('');
    try {
      await api.remove(hapusTarget.id);
      setHapusTarget(null);
      tampilkanPesan('Siswa dihapus.');
      muat();
    } catch (e) {
      setHapusError(e.message);
    } finally {
      setMenghapus(false);
    }
  }

  return (
    <div className="halaman">
      <header className="kepala">
        <div className="identitas">
          <div className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M7.5 13.5c5.8-2 11.3-.9 16.5 3.2v22c-5.2-4.1-10.7-5.2-16.5-3.2v-22Z" fill="currentColor" opacity=".78" />
              <path d="M40.5 13.5c-5.8-2-11.3-.9-16.5 3.2v22c5.2-4.1 10.7-5.2 16.5-3.2v-22Z" fill="currentColor" />
              <path d="M24 16.7v22M13 21c2.4-.4 4.7.1 7 1.4M35 21c-2.4-.4-4.7.1-7 1.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <path d="m35.5 7 .9 2.6L39 10.5l-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" fill="#FDE68A" />
            </svg>
          </div>
          <h1>Data Siswa</h1>
          <p className="eyebrow">RUANG SISWA <span aria-hidden="true">/</span> ADMINISTRASI</p>
          <p className="sub">{siswa.length} siswa {q && `untuk “${q}”`}</p>
        </div>
        <div className="kepala-aksi">
          <button
            className="tombol tema-toggle"
            type="button"
            onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')}
            aria-label={`Aktifkan tema ${tema === 'dark' ? 'terang' : 'gelap'}`}
            title={`Aktifkan tema ${tema === 'dark' ? 'terang' : 'gelap'}`}
          >
            {tema === 'dark' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.5A8.5 8.5 0 0 1 8.5 3.8 8.5 8.5 0 1 0 20.2 15.5Z" /><path d="m17 3 .5 1.5L19 5l-1.5.5L17 7l-.5-1.5L15 5l1.5-.5L17 3Z" /></svg>
            )}
            <span>{tema === 'dark' ? 'Terang' : 'Gelap'}</span>
          </button>
          <button className="tombol utama" onClick={() => setFormAwal({})}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            Tambah siswa
          </button>
        </div>
      </header>

      <div className="cari-bungkus">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
        <input
          className="cari"
          type="search"
          placeholder="Cari nama lengkap, kode siswa, atau jurusan"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari siswa"
        />
      </div>

      {error && <div className="galat" role="alert">{error}</div>}

      {loading ? (
        <p className="kosong">Memuat data…</p>
      ) : siswa.length === 0 ? (
        <div className="kosong">
          <div className="kosong-ilustrasi" aria-hidden="true">
            <svg viewBox="0 0 120 96" fill="none">
              <rect x="14" y="23" width="92" height="62" rx="14" fill="currentColor" opacity=".1" />
              <path d="M36 58a12 12 0 1 1 24 0v9H36v-9Z" fill="currentColor" opacity=".8" />
              <circle cx="48" cy="42" r="8" fill="currentColor" />
              <path d="M67 40h23M67 51h18M67 62h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".55" />
              <path d="m25 18 2-6 2 6 6 2-6 2-2 6-2-6-6-2 6-2ZM94 17l1.5-4.5L97 17l4.5 1.5L97 20l-1.5 4.5L94 20l-4.5-1.5L94 17Z" fill="#F59E0B" />
            </svg>
          </div>
          <p>{q ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada data siswa. Klik “Tambah siswa” untuk memulai.'}</p>
        </div>
      ) : (
        <SiswaTable
          data={siswa}
          onUbah={setFormAwal}
          onHapus={(s) => {
            setHapusError('');
            setHapusTarget(s);
          }}
        />
      )}

      {formAwal && (
        <SiswaForm awal={formAwal} onSimpan={simpan} onBatal={() => setFormAwal(null)} />
      )}

      {hapusTarget && (
        <div
          className="latar konfirmasi-latar"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !menghapus) setHapusTarget(null);
          }}
        >
          <section
            className="konfirmasi-hapus"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="judul-hapus"
            aria-describedby="deskripsi-hapus"
          >
            <div className="ikon-hapus" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
            </div>
            <h2 id="judul-hapus">Hapus data siswa?</h2>
            <p id="deskripsi-hapus">
              Data <strong>{hapusTarget.nama}</strong> akan dihapus permanen dan tidak dapat dipulihkan.
            </p>
            {hapusError && <div className="galat" role="alert">{hapusError}</div>}
            <div className="konfirmasi-aksi">
              <button
                ref={batalHapusRef}
                className="tombol"
                type="button"
                disabled={menghapus}
                onClick={() => setHapusTarget(null)}
              >
                Batal
              </button>
              <button
                className="tombol tombol-hapus"
                type="button"
                disabled={menghapus}
                onClick={konfirmasiHapus}
              >
                {menghapus ? 'Menghapus…' : 'Ya, hapus'}
              </button>
            </div>
          </section>
        </div>
      )}

      {pesan && <div className="toast" role="status">{pesan}</div>}
    </div>
  );
}
