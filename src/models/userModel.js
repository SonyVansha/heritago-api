const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` akan memperbarui tabel jika ada perubahan
    console.log('Database & tabel user telah sinkron!');
  } catch (error) {
    console.error('Gagal sinkronisasi database:', error);
  }
}

// Jalankan fungsi syncDatabase untuk sinkronisasi database
syncDatabase(); 

module.exports = User;
