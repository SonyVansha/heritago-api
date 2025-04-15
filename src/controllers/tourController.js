const Wisata = require("../models/wisata");
const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const upload = multer();

// Membuat tours
const getTour = async (req, res) => {
  try {
    // Sequelize method to fetch all records
    const tours = await Wisata.findAll(); 
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTourbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Wisata.findByPk(Number(id)); // Sequelize method to fetch a record by ID
    if (!tour) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan tour baru
// const addTour = async (req, res) => {
//   const { nama, lokasi, gambar, deskripsi, rating } = req.body;
//   try {
//     // console.log('Request Body:', req.body); // Debugging input request

//     const newTour = await Wisata.create({ nama, lokasi, gambar, deskripsi, rating });
//     // create a new tour using the model
//     // const newTour = await modelTour.create(req.body);
//     res.status(200).json({ message: 'Data berhasil disimpan', data: newTour });
//   } catch (err) {
//     console.error('Error saat menambahkan wisata:', err); // Debugging error
//     res.status(500).json({ error: err.message });
//   }
// };
const addTour = async (req, res) => {
  const { nama, lokasi, deskripsi, rating } = req.body;
  const file = req.file;

  console.log('Request body:', req.body); // Menampilkan request body untuk debugging

  try {
    let imageUrl = null;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `wisata/${fileName}`; // path di dalam bucket

      // Meng-upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('bucketwisata') // Ganti dengan nama bucket-mu
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      // Mendapatkan URL publik untuk file yang diupload
      const { data, error: urlError } = supabase.storage
        .from('bucketwisata') // Nama bucket
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      imageUrl = data.publicUrl;
    }

    // Menyimpan data wisata ke database
    const newTour = await Wisata.create({
      nama,
      lokasi,
      gambar: imageUrl,
      deskripsi,
      rating,
    });

    res.status(200).json({ message: 'Data berhasil disimpan', data: newTour });
  } catch (err) {
    console.error('Error saat menambahkan wisata:', err);
    res.status(500).json({ error: err.message });
  }
};


// Menghapus tour
// const deleteTour = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("ID yang diterima untuk dihapus:", id);

//     // Validate the ID of the tour
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: "ID wisata tidak valid" });
//     }

//     // Delete the tour using the model
//     // const deletedCount = await modelTour.delete(Number(id));

//     const deletedCount = await Wisata.destroy({
//       where: { id: Number(id) }, // Ensure ID is a number
//     });

//     // Check if the tour was deleted successfully
//     if (deletedCount === 0) {
//       return res.status(404).json({ error: "Data tidak ditemukan" });
//     }

//     res.status(200).json({ message: "Data berhasil dihapus", data: id });
//   } catch (err) {
//     console.error("Error saat menghapus wisata:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };


const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID yang diterima untuk dihapus:", id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID wisata tidak valid" });
    }

    // Cari data wisata dulu untuk ambil URL gambarnya
    const tour = await Wisata.findOne({ where: { id: Number(id) } });

    if (!tour) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    // Ambil path file dari URL Supabase
    let filePath = null;
    if (tour.gambar) {
      const url = new URL(tour.gambar);
      const parts = url.pathname.split('/');
      // Misal: /storage/v1/object/public/bucketstoragetes/wisata/namafile.jpg
      const index = parts.findIndex(part => part === 'public');
      if (index !== -1) {
        filePath = parts.slice(index + 2).join('/'); // Dapatkan path dalam bucket
      }
    }

    // Hapus gambar dari Supabase Storage
    if (filePath) {
      const { error: deleteError } = await supabase.storage
        .from('bucketstoragetes') // Ganti sesuai bucket kamu
        .remove([filePath]);

      if (deleteError) {
        console.error("Gagal menghapus gambar dari storage:", deleteError.message);
      } else {
        console.log("Gambar berhasil dihapus dari Supabase Storage.");
      }
    }

    // Hapus data dari database
    const deletedCount = await Wisata.destroy({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Data dan gambar berhasil dihapus", data: id });
  } catch (err) {
    console.error("Error saat menghapus wisata:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getTour, getTourbyId, addTour, deleteTour };
