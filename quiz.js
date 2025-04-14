const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Contoh data postingan dan kuis (dalam memori untuk kesederhanaan)
const posts = {
    1: { title: "Postingan 1", quizId: 101 },
    2: { title: "Postingan 2", quizId: 102 }
};

const quizzes = {
    101: {
        quizId: 101,
        questions: [
            { questionId: 1, text: "Warna langit?", options: ["Merah", "Biru"], correctAnswer: "Biru" },
            { questionId: 2, text: "Jumlah kaki kucing?", options: ["2", "4"], correctAnswer: "4" }
        ]
    },
    102: {
        quizId: 102,
        questions: [
            { questionId: 3, text: "Ibukota Prancis?", options: ["Berlin", "Paris"], correctAnswer: "Paris" }
        ]
    }
};

// Endpoint untuk mendapatkan kuis berdasarkan ID postingan
app.get('/api/posts/:postId/quiz', (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = posts[postId];

    if (!post) {
        return res.status(404).json({ error: 'Postingan tidak ditemukan' });
    }

    const quiz = quizzes[post.quizId];
    if (!quiz) {
        return res.status(404).json({ error: 'Kuis untuk postingan ini tidak ditemukan' });
    }

    res.json(quiz);
});

// Endpoint untuk mengirim jawaban kuis
app.post('/api/posts/:postId/quiz/submit', (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = posts[postId];

    if (!post) {
        return res.status(404).json({ error: 'Postingan tidak ditemukan' });
    }

    const quiz = quizzes[post.quizId];
    if (!quiz) {
        return res.status(404).json({ error: 'Kuis untuk postingan ini tidak ditemukan' });
    }

    const userAnswers = req.body.answers;
    if (!userAnswers || typeof userAnswers !== 'object') {
        return res.status(400).json({ error: 'Data jawaban tidak valid' });
    }

    const results = [];
    let score = 0;

    for (const question of quiz.questions) {
        const questionId = question.questionId;
        const correctAnswer = question.correctAnswer;
        const userAnswer = userAnswers[questionId];
        const isCorrect = userAnswer === correctAnswer;

        results.push({
            questionId: questionId,
            correctAnswer: correctAnswer,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            score++;
        }
    }

    res.json({ score: score, totalQuestions: quiz.questions.length, results: results });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});