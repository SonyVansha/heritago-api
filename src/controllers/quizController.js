// const Quiz = require('../models/quiz');
// const Question = require('../models/question');

// const getQuizByPostId = async (req, res) => {
//   const postId = parseInt(req.params.postId);

//   try {
//     const quizMap = { 1: 1, 2: 2 }; // Sesuaikan dengan logika Anda
//     const quizId = quizMap[postId];

//     if (!quizId) {
//       return res.status(404).json({ error: 'Kuis tidak ditemukan untuk postId ini' });
//     }

//     const quiz = await Quiz.findByPk(quizId, {
//       include: [{
//         model: Question,
//         as: 'Questions' // Alias harus sesuai dengan asosiasi yang sudah didefinisikan
//       }]
//     });

//     if (!quiz) {
//       return res.status(404).json({ error: 'Kuis tidak ditemukan' });
//     }

//     if (!quiz.Questions || quiz.Questions.length === 0) {
//       return res.status(404).json({ error: 'Pertanyaan kuis tidak ditemukan' });
//     }

//     res.json({
//       quizId: quiz.id,
//       questions: quiz.Questions.map(q => ({
//         questionId: q.id,
//         text: q.text,
//         options: q.options
//       }))
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Gagal mengambil kuis' });
//   }
// };

// const submitQuiz = async (req, res) => {
//   const { quizId, answers } = req.body;

//   try {
//     const quiz = await Quiz.findByPk(quizId, {
//       include: [{
//         model: Question,
//         as: 'Questions' // Alias harus sesuai dengan asosiasi
//       }]
//     });

//     if (!quiz) {
//       return res.status(404).json({ error: 'Quiz tidak ditemukan' });
//     }

//     if (!quiz.Questions || quiz.Questions.length === 0) {
//       return res.status(404).json({ error: 'Tidak ada pertanyaan dalam kuis ini' });
//     }

//     let correctCount = 0;
//     let results = [];

//     quiz.Questions.forEach((question) => {
//       const userAnswer = answers[question.id];
//       const isCorrect = userAnswer === question.correctAnswer;

//       results.push({
//         questionId: question.id,
//         questionText: question.text,
//         userAnswer: userAnswer || null,
//         correctAnswer: question.correctAnswer,
//         isCorrect
//       });

//       if (isCorrect) correctCount++;
//     });

//     const scorePercentage = (correctCount / quiz.Questions.length) * 100;

//     const response = {
//       certificateEligible: scorePercentage >= 90,
//       score: scorePercentage,
//       totalQuestions: quiz.Questions.length,
//       results
//     };

//     res.json(response);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Gagal memproses kuis' });
//   }
// };

// module.exports = { getQuizByPostId, submitQuiz };

const Quiz = require('../models/quiz');
const Question = require('../models/question');

// Mendapatkan semua quiz hanya dengan id dan title
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      attributes: ['id', 'title'] // Ambil hanya id dan title
    });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ error: 'Tidak ada quiz ditemukan' });
    }

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data quiz' });
  }
};

// Mengambil quiz berdasarkan postId
const getQuizByPostId = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const quizMap = { 1: 1, 2: 2 }; // Sesuaikan dengan logika Anda
    const quizId = quizMap[postId];

    if (!quizId) {
      return res.status(404).json({ error: 'Kuis tidak ditemukan untuk postId ini' });
    }

    // Ambil quiz berdasarkan quizId
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Kuis tidak ditemukan' });
    }

    // Ambil pertanyaan yang terkait dengan quizId tertentu
    const questions = await Question.findAll({
      where: { quizId: quizId } // Filter berdasarkan quizId
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'Pertanyaan kuis tidak ditemukan' });
    }

    // Kirimkan hasil kuis dengan pertanyaan yang sesuai
    res.json({
      quizId: quiz.id,
      questions: questions.map(q => ({
        questionId: q.id,
        text: q.text,
        options: q.options
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil kuis' });
  }
};

// Menyimpan hasil jawaban kuis
const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    // Ambil quiz berdasarkan quizId
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz tidak ditemukan' });
    }

    // Ambil pertanyaan yang terkait dengan quizId
    const questions = await Question.findAll({
      where: { quizId: quizId } // Filter berdasarkan quizId
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'Tidak ada pertanyaan dalam kuis ini' });
    }

    let correctCount = 0;
    let results = [];

    // Mengevaluasi jawaban user untuk setiap pertanyaan
    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      results.push({
        questionId: question.id,
        questionText: question.text,
        userAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect
      });

      if (isCorrect) correctCount++;
    });

    const scorePercentage = (correctCount / questions.length) * 100;

    const response = {
      certificateEligible: scorePercentage >= 90,
      score: scorePercentage,
      totalQuestions: questions.length,
      results
    };

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memproses kuis' });
  }
};

module.exports = { getQuizByPostId, submitQuiz, getAllQuizzes };
