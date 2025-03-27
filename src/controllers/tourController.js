const modelTour = require("../models/tourModels"); // Assuming Sequelize models are defined and exported from models/index.js

// Membuat tours
const getTour = async (req, res) => {
  try {
    const tours = await modelTour.getAll(); // Sequelize method to fetch all records
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan tour baru
const addTour = async (req, res) => {
  try {
    // console.log('Request Body:', req.body); // Debugging input request

    // create a new tour using the model
    const newTour = await modelTour.create(req.body);
    res.status(200).json({ message: 'Data berhasil disimpan', data: newTour });
  } catch (err) {
    console.error('Error saat menambahkan wisata:', err); // Debugging error
    res.status(500).json({ error: err.message });
  }
};

// Menghapus tour
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID yang diterima untuk dihapus:", id);

    // Validate the ID of the tour
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID wisata tidak valid" });
    }

    // Delete the tour using the model
    const deletedCount = await modelTour.delete(Number(id));

    // Check if the tour was deleted successfully
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    res.status(200).json({ message: "Data berhasil dihapus", data: id });
  } catch (err) {
    console.error("Error saat menghapus wisata:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getTour, addTour, deleteTour };
