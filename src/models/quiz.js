const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'quizzes',
  // Jika kamu tidak memerlukan kolom createdAt/updatedAt
  timestamps: false,
});

module.exports = Quiz;
