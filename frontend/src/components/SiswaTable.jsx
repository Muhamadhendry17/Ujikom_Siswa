function formatTanggal(t) {
  if (!t) return '-';
  const [y, m, d] = t.split('-');
  return `${d}/${m}/${y}`;
}

export default function SiswaTable({ data, onUbah, onHapus }) {
  return (
    <div className="tabel-bungkus">
      <table>
        <thead>
          <tr>
            <th>Kode siswa</th>
            <th>Nama lengkap</th>
            <th>Jurusan</th>
            <th>JK</th>
            <th>Tgl. lahir</th>
            <th>No. HP</th>
            <th aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.id}>
              <td className="nis">{s.nis}</td>
              <td>
                <strong>{s.nama}</strong>
                {s.alamat && <div className="alamat">{s.alamat}</div>}
              </td>
              <td>{s.kelas}</td>
              <td>{s.jenis_kelamin}</td>
              <td>{formatTanggal(s.tanggal_lahir)}</td>
              <td>{s.no_hp || '-'}</td>
              <td className="aksi">
                <button className="tombol kecil" onClick={() => onUbah(s)}>Ubah</button>
                <button className="tombol kecil bahaya" onClick={() => onHapus(s)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
