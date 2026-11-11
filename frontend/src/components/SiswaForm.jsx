import { useState } from 'react';

const KOSONG = {
  nis: '',
  nama: '',
  kelas: '',
  jenis_kelamin: 'L',
  tanggal_lahir: '',
  alamat: '',
  no_hp: '',
};

export default function SiswaForm({ awal, onSimpan, onBatal }) {
  const ubah = Boolean(awal.id);
  const [v, setV] = useState({
    ...KOSONG,
    ...Object.fromEntries(Object.entries(awal).map(([k, val]) => [k, val ?? ''])),
  });
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    setMenyimpan(true);
    try {
      await onSimpan(v);
    } catch (err) {
      setGalat(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <div className="latar" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <form className="modal" onSubmit={kirim}>
        <h2>{ubah ? 'Ubah data siswa' : 'Tambah siswa'}</h2>

        <div className="baris">
          <label>
            Kode siswa
            <input value={v.nis} onChange={set('nis')} required autoFocus />
          </label>
          <label>
            Jurusan
            <input value={v.kelas} onChange={set('kelas')} placeholder="Contoh: RPL" required />
          </label>
        </div>

        <label>
          Nama lengkap
          <input value={v.nama} onChange={set('nama')} required />
        </label>

        <div className="baris">
          <label>
            Jenis kelamin
            <select value={v.jenis_kelamin} onChange={set('jenis_kelamin')}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </label>
          <label>
            Tanggal lahir
            <input type="date" value={v.tanggal_lahir} onChange={set('tanggal_lahir')} />
          </label>
        </div>

        <label>
          No. HP
          <input value={v.no_hp} onChange={set('no_hp')} inputMode="tel" />
        </label>

        <label>
          Alamat
          <textarea rows="2" value={v.alamat} onChange={set('alamat')} />
        </label>

        {galat && <div className="galat" role="alert">{galat}</div>}

        <div className="tombol-form">
          <button type="button" className="tombol" onClick={onBatal}>Batal</button>
          <button type="submit" className="tombol utama" disabled={menyimpan}>
            {menyimpan ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
