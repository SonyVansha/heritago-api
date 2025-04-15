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
const path = require('path');
const fs = require('fs/promises');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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

const generateCertificateWithBackgroundBackend = async (req, res, name, course) => {
  if (!name || !course) {
    return res.status(400).json({ error: 'Nama dan kursus diperlukan.' });
  }

  try {
    const backgroundImagePath = path.join(__dirname, '..', 'public', 'img', 'template.png');
    await fs.access(backgroundImagePath); // Cek apakah file ada

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
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const textColor = rgb(0, 0, 0);

    page.drawText(name, {
      x: 350,
      y: 400,
      font,
      size: 70,
      color: textColor,
    });

    page.drawText(course, {
      x: 350,
      y: 350,
      font: italicFont,
      size: 30,
      color: textColor,
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sertifikat_${name.replace(/\s/g, '_')}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Gagal membuat sertifikat:', error);
    res.status(500).json({ error: 'Gagal membuat sertifikat.' });
  }
};

// Menyimpan hasil jawaban kuis
const submitQuiz = async (req, res) => {
  const { quizId, answers, name } = req.body;

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

    // Jika pengguna memenuhi syarat untuk mendapatkan sertifikat, buat sertifikat
    if (scorePercentage >= 90) {
      const courseName = quiz.title;
      const downloadUrl = `/api/posts/certificate?name=${encodeURIComponent(name)}&course=${encodeURIComponent(courseName)}`;
    
          // Jika pengguna memenuhi syarat untuk mendapatkan sertifikat, buat sertifikat
    // if (scorePercentage >= 90) {
    //   const courseName = quiz.title;
    //   return generateCertificateWithBackgroundBackend(req, res, name, courseName);
    // }
      return res.json({
        certificateEligible: true,
        score: scorePercentage,
        totalQuestions: questions.length,
        results,
        certificateDownloadUrl: downloadUrl
      });
      // res.json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memproses kuis' });
  }
};

const getCertificate = async (req, res) => {
  const { name, course } = req.query;
  return generateCertificateWithBackgroundBackend(req, res, name, course);
};

module.exports = { getQuizByPostId, submitQuiz, getAllQuizzes, getCertificate };
