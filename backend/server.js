const express = require('express');
const path = require('path');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Menyajikan file statis dari folder frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ==================== REST API BARANG ===================

// 1. GET /api/barang -> Mengambil semua data barang, diurutkan dari yang terbaru
app.get('/api/barang', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM barang ORDER BY id DESC');
    res.json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error GET /api/barang:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data barang' });
  }
});

// 2. POST /api/barang -> Menambah barang baru
app.post('/api/barang', async (req, res) => {
  try {
    const { nama_barang, harga, stok } = req.body;

    if (!nama_barang || harga === undefined || stok === undefined) {
      return res.status(400).json({ status: 'error', message: 'Semua field (nama_barang, harga, stok) wajib diisi' });
    }

    const query = 'INSERT INTO barang (nama_barang, harga, stok) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [nama_barang, harga, stok]);

    res.status(201).json({
      status: 'success',
      message: 'Barang berhasil ditambahkan',
      data: { id: result.insertId, nama_barang, harga, stok }
    });
  } catch (error) {
    console.error('Error POST /api/barang:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan barang' });
  }
});

// 3. PUT /api/barang/:id -> Mengubah data barang berdasarkan ID
app.put('/api/barang/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_barang, harga, stok } = req.body;

    if (!nama_barang || harga === undefined || stok === undefined) {
      return res.status(400).json({ status: 'error', message: 'Semua field (nama_barang, harga, stok) wajib diisi' });
    }

    const query = 'UPDATE barang SET nama_barang = ?, harga = ?, stok = ? WHERE id = ?';
    const [result] = await db.query(query, [nama_barang, harga, stok, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Barang tidak ditemukan' });
    }

    res.json({
      status: 'success',
      message: 'Barang berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error PUT /api/barang/:id:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui barang' });
  }
});

// 4. DELETE /api/barang/:id -> Menghapus barang berdasarkan ID
app.delete('/api/barang/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM barang WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Barang tidak ditemukan' });
    }

    res.json({
      status: 'success',
      message: 'Barang berhasil dihapus'
    });
  } catch (error) {
    console.error('Error DELETE /api/barang/:id:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus barang' });
  }
});

// ==================== REST API PENJUALAN ===================

// 5. POST /api/penjualan -> Menerima array 'keranjang' dan mengurangi stok barang
app.post('/api/penjualan', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { keranjang } = req.body; // Contoh format: [{ id: 1, qty: 2 }, { id: 3, qty: 1 }]

    if (!keranjang || !Array.isArray(keranjang) || keranjang.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Keranjang belanja kosong atau format tidak valid' });
    }

    // Mulai transaksi database untuk menjaga konsistensi data stok
    await connection.beginTransaction();

    for (const item of keranjang) {
      const { id, qty } = item;

      if (!id || !qty || qty <= 0) {
        throw new Error('Item keranjang memiliki ID atau Qty yang tidak valid');
      }

      // Validasi stok saat ini dengan row locking (FOR UPDATE)
      const [rows] = await connection.query('SELECT stok FROM barang WHERE id = ? FOR UPDATE', [id]);
      if (rows.length === 0) {
        throw new Error(`Barang dengan ID ${id} tidak ditemukan`);
      }

      const stokSaatIni = rows[0].stok;
      if (stokSaatIni < qty) {
        throw new Error(`Stok tidak mencukupi untuk barang ID ${id} (Stok: ${stokSaatIni}, Diminta: ${qty})`);
      }

      // Kurangi stok di database
      await connection.query('UPDATE barang SET stok = stok - ? WHERE id = ?', [qty, id]);
    }

    // Commit transaksi jika semua berhasil
    await connection.commit();
    connection.release();

    res.json({
      status: 'success',
      message: 'Transaksi penjualan berhasil diproses dan stok telah diperbarui'
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error POST /api/penjualan:', error.message);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Backend Express.js & Database siap digunakan!' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Backend Express berjalan di http://localhost:${PORT}`);
});