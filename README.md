# Ruang Siswa — CRUD Data Siswa

Project ini mempertahankan fitur dan alur CRUD data siswa dengan tampilan frontend bertema hijau sage.

Stack: **Node.js + Express + MySQL (mysql2)** untuk backend dan **React (Vite)** untuk frontend.

## Persiapan
1. Node.js 18 atau lebih baru.
2. Server MySQL/MariaDB yang menyala. Cara termudah: pasang **XAMPP** atau **Laragon**, lalu Start MySQL.
3. Cek user dan password di `backend/db.js` (default: user `root`, tanpa password).
   Database `db_siswa` dan tabel `siswa` dibuat otomatis saat backend dijalankan.

## Menjalankan (dua terminal)

**Terminal 1 – backend (port 5000)**
```bash
cd backend
npm install
npm start
```

**Terminal 2 – frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```
Buka http://localhost:5173

Untuk password MySQL tanpa mengedit file, pakai environment variable, contoh:
`DB_PASSWORD=rahasia npm start` (Linux/macOS) atau `set DB_PASSWORD=rahasia && npm start` (Windows CMD).

## Fitur

- Tambah, lihat, ubah, dan hapus data siswa.
- Cari berdasarkan nama lengkap, kode siswa, atau jurusan.
- Simpan informasi jurusan, jenis kelamin, tanggal lahir, alamat, dan nomor HP.
- Tampilan responsif dengan palet hijau sage dan tipografi yang diperbarui.

## Endpoint API
| Method | URL               | Fungsi                              |
|--------|-------------------|-------------------------------------|
| GET    | /api/siswa?q=kata | Daftar siswa (opsional pencarian)   |
| GET    | /api/siswa/:id    | Detail satu siswa                   |
| POST   | /api/siswa        | Tambah siswa                        |
| PUT    | /api/siswa/:id    | Ubah siswa                          |
| DELETE | /api/siswa/:id    | Hapus siswa                         |
