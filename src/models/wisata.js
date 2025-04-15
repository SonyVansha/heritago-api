const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// console.log(sequelize);

const Wisata = sequelize.define('wisata', {
  // id: {
  //   type: DataTypes.INTEGER,
  //   autoIncrement: true,
  //   primaryKey: true,
  // },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'wisata',
  timestamps: true, // Set to true if your table has createdAt and updatedAt columns
});

// console.log("Wisata model:", Wisata);s

// Sinkronisasi database agar tabel dibuat secara otomatis jika belum ada
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` akan memperbarui tabel jika ada perubahan
    console.log('Database & tabel wisata telah sinkron!');
  } catch (error) {
    console.error('Gagal sinkronisasi database:', error);
  }
}

// Jalankan fungsi syncDatabase untuk sinkronisasi database
syncDatabase(); 

module.exports = Wisata;