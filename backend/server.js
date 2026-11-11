const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validasi input; mengembalikan { data } atau { error }
function validasi(body) {
  const data = {
    nis: String(body.nis ?? '').trim(),
    nama: String(body.nama ?? '').trim(),
    kelas: String(body.kelas ?? '').trim(),
    jenis_kelamin: String(body.jenis_kelamin ?? '').trim(),
    tanggal_lahir: String(body.tanggal_lahir ?? '').trim() || null,
    alamat: String(body.alamat ?? '').trim() || null,
    no_hp: String(body.no_hp ?? '').trim() || null,
  };

  if (!data.nis) return { error: 'Kode siswa wajib diisi.' };
  if (!data.nama) return { error: 'Nama lengkap wajib diisi.' };
  if (!data.kelas) return { error: 'Jurusan wajib diisi.' };
  if (!['L', 'P'].includes(data.jenis_kelamin)) {
    return { error: 'Jenis kelamin harus L atau P.' };
  }
  return { data };
}

function tanganiError(err, res) {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Kode siswa sudah terdaftar.' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}

const ambilSatu = async (id) => {
  const [rows] = await db.query('SELECT * FROM siswa WHERE id = ?', [id]);
  return rows[0];
};

// READ: semua siswa (opsional pencarian ?q=)
app.get('/api/siswa', async (req, res) => {
  try {
    const q = String(req.query.q ?? '').trim();
    const [rows] = q
      ? await db.query(
          `SELECT * FROM siswa
           WHERE nama LIKE ? OR nis LIKE ? OR kelas LIKE ?
           ORDER BY nama`,
          [`%${q}%`, `%${q}%`, `%${q}%`]
        )
      : await db.query('SELECT * FROM siswa ORDER BY nama');
    res.json(rows);
  } catch (err) {
    tanganiError(err, res);
  }
});

// READ: satu siswa
app.get('/api/siswa/:id', async (req, res) => {
  try {
    const row = await ambilSatu(req.params.id);
    if (!row) return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
    res.json(row);
  } catch (err) {
    tanganiError(err, res);
  }
});

// CREATE
app.post('/api/siswa', async (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const [hasil] = await db.query('INSERT INTO siswa SET ?', [data]);
    res.status(201).json(await ambilSatu(hasil.insertId));
  } catch (err) {
    tanganiError(err, res);
  }
});

// UPDATE
app.put('/api/siswa/:id', async (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    if (!(await ambilSatu(req.params.id))) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
    }
    await db.query('UPDATE siswa SET ? WHERE id = ?', [data, req.params.id]);
    res.json(await ambilSatu(req.params.id));
  } catch (err) {
    tanganiError(err, res);
  }
});

// DELETE
app.delete('/api/siswa/:id', async (req, res) => {
  try {
    const [hasil] = await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    if (hasil.affectedRows === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
    }
    res.status(204).end();
  } catch (err) {
    tanganiError(err, res);
  }
});

db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`API berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung ke MySQL:', err.message);
    console.error('Pastikan MySQL sudah menyala dan user/password di backend/db.js benar.');
    process.exit(1);
  });
