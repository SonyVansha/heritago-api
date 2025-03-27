const modelTour = require("../models/tourModels");


// Simpan data sementara di memori
let data = [];

// Membuat tours
const getTour = async (req, res) => {
  try {
    const tours = await modelTour.getAll();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan tour baru
const addTour = async (req, res) => {
  try {
    const newTour = await modelTour.create(req.body);
    res.status(200).json({ message: 'Data berhasil disimpan', data: newTour });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// menghapus tour
const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await modelTour.delete(id);

    // Jika data tidak ditemukan
    if (result === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Jika data berhasil dihapus
    res.json({ message: 'Data berhasil dihapus', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTour, addTour, deleteTour };