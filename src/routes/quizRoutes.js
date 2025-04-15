const express = require('express');
const router = express.Router();
const { getQuizByPostId, submitQuiz, getAllQuizzes, getCertificate } = require('../controllers/quizController');

// Route untuk mendapatkan semua kuis
router.get('/quizzes', getAllQuizzes);
router.get('/posts/:postId/quiz', getQuizByPostId);
// router.post('/posts/quiz', submitQuiz); // Beta untuk mengirimkan hasil kuis
router.post('/posts/quiz/submit', submitQuiz);
router.get('/posts/certificate', getCertificate);

module.exports = router;
