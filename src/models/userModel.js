const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Sinkronisasi Model dengan Database
sequelize.sync().then(() => {
  console.log("Database & tables synced!");
});

module.exports = User;
