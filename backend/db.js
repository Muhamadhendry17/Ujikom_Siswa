const mysql = require('mysql2/promise');

// Ubah sesuai MySQL kamu (default XAMPP/Laragon: user root, tanpa password).
// Bisa juga lewat environment variable: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};
const NAMA_DB = process.env.DB_NAME || 'db_siswa';

let pool;

// Membuat database + tabel otomatis bila belum ada, lalu membuka pool koneksi.
async function init() {
  const awal = await mysql.createConnection(config);
  await awal.query(
    `CREATE DATABASE IF NOT EXISTS \`${NAMA_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await awal.end();

  pool = mysql.createPool({
    ...config,
    database: NAMA_DB,
    dateStrings: true, // tanggal dikembalikan sebagai teks "YYYY-MM-DD"
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS siswa (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      nis            VARCHAR(30)  NOT NULL UNIQUE,
      nama           VARCHAR(100) NOT NULL,
      kelas          VARCHAR(30)  NOT NULL,
      jenis_kelamin  ENUM('L', 'P') NOT NULL,
      tanggal_lahir  DATE NULL,
      alamat         TEXT NULL,
      no_hp          VARCHAR(20) NULL,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4
  `);
}

const query = (sql, params) => pool.query(sql, params);

module.exports = { init, query };
