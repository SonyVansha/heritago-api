const express = require('express');
const router = express.Router();
const { getQuizByPostId, submitQuiz, getAllQuizzes } = require('../controllers/quizController');

// Route untuk mendapatkan semua kuis
router.get('/quizzes', getAllQuizzes);
router.get('/posts/:postId/quiz', getQuizByPostId);
router.post('/posts/quiz/submit', submitQuiz);

module.exports = router;
