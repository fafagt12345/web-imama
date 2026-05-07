CREATE DATABASE IF NOT EXISTS db_imama;
USE db_imama;

-- Tabel untuk data "Tentang Kami"
CREATE TABLE IF NOT EXISTS about (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data awal untuk About
INSERT INTO about (content) 
SELECT 'Selamat datang di IMAMA UNESA.' 
WHERE NOT EXISTS (SELECT 1 FROM about LIMIT 1);

-- Tabel untuk Slide Hero
CREATE TABLE IF NOT EXISTS hero_slides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Pengaturan Website (Kontak, Medsos, Title)
CREATE TABLE IF NOT EXISTS settings (
    s_key VARCHAR(50) PRIMARY KEY,
    s_value TEXT
);

INSERT IGNORE INTO settings (s_key, s_value) VALUES 
('email', 'imama.unesa@gmail.com'),
('instagram', 'imama_unesa'),
('hero_title', 'IMAMA UNESA'),
('hero_subtitle', 'Ikatan Mahasiswa Manajemen Akuntansi Universitas Negeri Surabaya');

-- Tabel untuk Kegiatan/Events
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Umum',
    description TEXT,
    event_date DATE,
    image_data LONGTEXT, -- Menyimpan string Base64 dari gambar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Galeri
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_data LONGTEXT NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Pengurus (Staff)
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department ENUM('BPH', 'DPM', 'INFOKOM', 'DBM', 'EKRAF', 'DPO', 'KORWIL') NOT NULL,
    image_data LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk Timeline Perjalanan
CREATE TABLE IF NOT EXISTS timeline (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(10) NOT NULL,
    event TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);