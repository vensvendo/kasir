# ⚡ POS Desktop Pro (Aplikasi Kasir Desktop)

Aplikasi Point of Sales (POS) / Kasir Desktop modern yang dibangun menggunakan teknologi cross-platform **Electron**, **Node.js**, **Express.js**, dan database relasional **MySQL**. Dirancang dengan arsitektur Single Page Application (SPA) dan antarmuka responsif berbasis **Tailwind CSS**.

---

## 🛠️ Teknologi & Versi

| Teknologi | Fungsi | Versi | Status |
| :--- | :--- | :--- | :--- |
| **Electron** | Framework Desktop Cross-Platform | `^30.0.0` | Desktop Runtime |
| **Node.js** | Runtime Environment JavaScript | `v18+ / v20+` | Backend & Process Manager |
| **Express.js** | Backend Web Framework & REST API | `^4.19.2` | API Server (Port 3000) |
| **MySQL2** | Driver MySQL dengan Promise & Pooling | `^3.9.7` | Database Connector |
| **Tailwind CSS** | Utility-First CSS Framework (via CDN) | Latest | Frontend Styling |
| **Electron Packager**| Tool untuk Build Aplikasi ke `.exe` | `^17.1.2` | Build Tool |

---

## 📁 Struktur Direktori Proyek

```text
pos-desktop/
├── backend/
│   ├── config/
│   │   └── db.js          # Konfigurasi Connection Pool MySQL
│   ├── database.sql       # Skrip SQL pembuatan DB & Tabel Barang
│   └── server.js          # REST API Backend (CRUD & Transaksi)
├── frontend/
│   ├── app.js             # Controller SPA & Global State
│   ├── index.html         # Kerangka Utama (Shell) & Navbar
│   ├── penjualan.html     # Tab Penjualan & Keranjang
│   └── stok.html          # Tab Manajemen Stok & CRUD Barang
├── .gitignore             # File yang diabaikan Git
├── main.js                # Entry Point Utama Electron
└── package.json           # Konfigurasi Dependensi & Skrip
```

---

## 🚀 Fitur Utama

1. **Arsitektur Hybrid Desktop & Backend**: Electron secara otomatis menjalankan server Express.js di latar belakang saat aplikasi dibuka.
2. **Manajemen Stok Aman (Transaction & Row Locking)**:
   - Endpoint `/api/penjualan` menggunakan **Database Transaction** (`beginTransaction`, `commit`, `rollback`) serta **Row Locking (`FOR UPDATE`)** untuk mencegah *race condition* stok saat transaksi konkuren.
   - Validasi stok otomatis baik di sisi frontend maupun backend.
3. **Tab Penjualan (Kasir)**:
   - Grid produk interaktif dengan fitur pencarian real-time.
   - Keranjang belanja dinamis dengan tombol tambah/kurang kuantitas dan validasi stok.
   - Kalkulator kembalian otomatis dan deteksi status uang kurang.
   - Modal sukses transaksi.
4. **Tab Manajemen Stok Barang (Inventory)**:
   - Form input dan edit data barang (Nama, Harga, Stok).
   - Tabel inventaris lengkap dengan tombol aksi Edit dan Hapus.

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
Pastikan komputer Anda telah menginstal:
- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- [MySQL Server / XAMPP](https://www.apachefriends.org/index.html) (aktifkan layanan MySQL)

### 2. Kloning Repositori
```bash
git clone https://github.com/vensvendo/kasir.git
cd kasir
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Database
1. Buka klien MySQL Anda (phpMyAdmin, DBeaver, atau MySQL CLI).
2. Jalankan skrip SQL yang tersedia di dalam file `backend/database.sql` untuk membuat database `db_kasir` beserta tabel `barang` dan data dummy.

### 5. Menjalankan Aplikasi (Mode Development)
```bash
npm start
```

### 6. Build Aplikasi ke File Eksekutabel (`.exe`)
Untuk mem-build aplikasi menjadi file installer/executable khusus Windows (x64):
```bash
npm run build:win
```
File `.exe` akan otomatis tersimpan di dalam folder `dist/`.

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).
