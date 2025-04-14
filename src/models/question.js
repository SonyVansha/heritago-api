// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const Quiz = require('./quiz'); // Import Quiz here

// const Question = sequelize.define('Question', {
//   text: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   options: {
//     type: DataTypes.JSON,
//     allowNull: false,
//   },
//   correctAnswer: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   quizId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'quizzes', // Ensure this matches the name of the table
//       key: 'id',
//     },
//     allowNull: false,
//   }
// }, {
//   tableName: 'questions',
//   timestamps: false,
// });

// // Asosiasi: Question belongs to Quiz
// Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'Quiz' });

// module.exports = Question;

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
      model: 'quizzes', // Menghubungkan dengan model Quiz
      key: 'id', // Menghubungkan dengan kolom 'id' di tabel 'quizzes'
    }
  }
}, {
  tableName: 'questions',
  timestamps: false, // Jika kamu tidak memerlukan kolom createdAt/updatedAt
});

module.exports = Question;
