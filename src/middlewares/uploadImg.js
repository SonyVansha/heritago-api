const multer = require('multer');

// Menggunakan memoryStorage agar file disimpan sementara di memori
const storage = multer.memoryStorage();

// Membatasi ukuran file maksimal (misalnya 5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log('File diterima:', file); // Debug log
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Izinkan file gambar
    } else {
      cb(new Error('File harus berupa gambar'), false); // Hanya izinkan gambar
    }
  }
});

// Export middleware upload untuk digunakan di route
module.exports = upload;
