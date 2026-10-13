const mysql = require('mysql2/promise');

// Konfigurasi Connection Pool MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_kasir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi database saat modul dimuat
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Berhasil terhubung ke database MySQL (db_kasir)');
    connection.release();
  } catch (error) {
    console.error('Gagal terhubung ke database MySQL:', error.message);
  }
})();

module.exports = pool;
