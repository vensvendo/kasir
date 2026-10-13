-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS db_kasir;

-- Gunakan database db_kasir
USE db_kasir;

-- Buat tabel barang
CREATE TABLE IF NOT EXISTS barang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  harga INT NOT NULL,
  stok INT NOT NULL
);

-- Data contoh (opsional untuk testing)
INSERT INTO barang (nama_barang, harga, stok) VALUES 
('Kopi Hitam', 10000, 50),
('Roti Bakar', 15000, 30),
('Es Teh Manis', 5000, 100);
