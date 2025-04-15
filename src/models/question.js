const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      // Menghubungkan dengan model Quiz
      model: 'wisata',
      // Menghubungkan dengan kolom 'id' di tabel 'quizzes'
      key: 'id',
    }
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'questions',
  timestamps: false, // Jika kamsu tidak memerlukan kolom createdAt/updatedAt
});

module.exports = Question;
