// const Quiz = require('./models/quiz');
// const Question = require('./models/question');

// // Pastikan asosiasi dilakukan setelah kedua model dimuat
// Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'Questions' });
// Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'Quiz' });

// // Kemudian Anda bisa melakukan sync jika diperlukan
// sequelize.sync({ force: false })  // Hati-hati dengan force: true, ini akan menghapus data yang ada
//   .then(() => console.log('Database synced'))
//   .catch(err => console.error('Error syncing database:', err));
