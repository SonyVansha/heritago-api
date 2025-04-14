const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('node:fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
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
            { questionId: 1, text: "Pertanyaan 1?", options: ["A", "B"], correctAnswer: "A" },
            { questionId: 2, text: "Pertanyaan 2?", options: ["C", "D"], correctAnswer: "D" },
            { questionId: 3, text: "Pertanyaan 3?", options: ["E", "F"], correctAnswer: "F" },
            { questionId: 4, text: "Pertanyaan 4?", options: ["G", "H"], correctAnswer: "G" },
            { questionId: 5, text: "Pertanyaan 5?", options: ["I", "J"], correctAnswer: "I" },
            { questionId: 6, text: "Pertanyaan 6?", options: ["K", "L"], correctAnswer: "L" },
            { questionId: 7, text: "Pertanyaan 7?", options: ["M", "N"], correctAnswer: "M" },
            { questionId: 8, text: "Pertanyaan 8?", options: ["O", "P"], correctAnswer: "O" },
            { questionId: 9, text: "Pertanyaan 9?", options: ["Q", "R"], correctAnswer: "Q" },
            { questionId: 10, text: "Pertanyaan 10?", options: ["S", "T"], correctAnswer: "S" }
        ]
    },
    102: {
        quizId: 102,
        questions: [
            { questionId: 11, text: "Pertanyaan Lain 1?", options: ["X", "Y"], correctAnswer: "Y" }
        ]
    }
};

// Endpoint untuk mendapatkan kuis berdasarkan ID postingan (tetap sama)
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

// Endpoint untuk mengirim jawaban kuis dan menentukan apakah pengguna berhak atas sertifikat
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
    let correctCount = 0;

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
            correctCount++;
        }
    }

    const scorePercentage = (correctCount / quiz.questions.length) * 100;

    if (scorePercentage >= 90) {
        // Pengguna berhak mendapatkan sertifikat
        return res.json({
            certificateEligible: true,
            quizId: quiz.quizId // Anda mungkin ingin mengirimkan ID kuis sebagai referensi
        });
    } else {
        // Kembalikan skor seperti biasa
        return res.json({
            certificateEligible: false,
            score: scorePercentage,
            totalQuestions: quiz.questions.length,
            results: results
        });
    }
});

async function generateCertificateWithBackgroundBackend(req, res) {
    const { name, course } = req.body;

    if (!name || !course) {
        return res.status(400).json({ error: 'Nama dan kursus diperlukan.' });
    }

    try {
        const backgroundImagePath = path.join(__dirname, 'src', 'public', 'img', 'template.png');

        try {
            await fs.access(backgroundImagePath);
        } catch (error) {
            console.error('File latar belakang tidak ditemukan:', backgroundImagePath);
            return res.status(500).json({ error: 'File latar belakang tidak ditemukan.' });
        }

        const backgroundImageBytes = await fs.readFile(backgroundImagePath);
        const pdfDoc = await PDFDocument.create();
        const backgroundPng = await pdfDoc.embedPng(backgroundImageBytes);
        const page = pdfDoc.addPage([backgroundPng.width, backgroundPng.height]);

        page.drawImage(backgroundPng, {
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: page.getHeight(),
        });

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        const textColor = rgb(0, 0, 0);

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const titleFontSize = 48;
        const recipientTitleFontSize = 24;
        const recipientNameFontSize = 10 * 7;
        const courseTitleFontSize = 24;
        const courseNameFontSize = 30;

        // Sesuaikan posisi teks nama dan kursus sesuai template Anda
        page.drawText(name, {
            x: 350, // Sesuaikan posisi X
            y: 400, // Sesuaikan posisi Y
            font,
            size: recipientNameFontSize,
            color: textColor,
        });

        page.drawText(course, {
            x: 350, // Sesuaikan posisi X
            y: 350, // Sesuaikan posisi Y
            font: italicFont,
            size: courseNameFontSize,
            color: textColor,
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="sertifikat_${name.replace(/\s/g, '_')}.pdf"`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Gagal membuat sertifikat dengan latar belakang:', error);
        res.status(500).json({ error: 'Gagal membuat sertifikat.' });
    }
}

app.post('/api/generate-certificate', generateCertificateWithBackgroundBackend);

app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
});