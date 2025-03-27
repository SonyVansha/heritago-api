const Wisata = require("./wisata");

const modelTour = {
  getAll: async () => {
    return await Wisata.findAll();
  },
  getById: async (id) => {
    return await Wisata.findByPk(id);
  },
  // Menambahkan wisata baru
  create: async (data) => {
    // console.log('Data yang diterima:', data); // Debugging untuk cek input
    
    // Validasi data yang diterima
    if (!Wisata) {
      throw new Error('Model Wisata belum terdefinisi');
    }

    // Buat data wisata baru
    const result = await Wisata.create(data);
    return result; // Kembalikan objek wisata yang baru dibuat
  },
  delete: async (id) => {
    // console.log("🛠️ ID yang diterima untuk delete:", id);
  
    // Validasi ID yang diterima
    if (!id || isNaN(id)) {
      throw new Error(`ID tidak valid: ${id}`);
    }
  
    // Hapus data wisata berdasarkan ID
    const result = await Wisata.destroy({
      where: { id: Number(id) }, // Pastikan ID dikonversi ke angka
    });
  
    return result; // Mengembalikan jumlah baris yang terhapus
  },
  
};

module.exports = modelTour;