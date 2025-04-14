// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Quiz = sequelize.define('Quiz', {
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   }
// }, {
//   tableName: 'quizzes',
//   timestamps: false,
// });

// // Ensure the association is set after the model is defined
// Quiz.hasMany(require('./question'), { foreignKey: 'quizId', as: 'Questions' });

// module.exports = Quiz;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'quizzes',
  timestamps: false, // Jika kamu tidak memerlukan kolom createdAt/updatedAt
});

module.exports = Quiz;
