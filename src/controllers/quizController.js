// const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Wisata = require('../models/wisata');
const path = require('path');
const fs = require('fs/promises');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Mendapatkan semua quiz hanya dengan id dan nama
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Wisata.findAll({
      attributes: ['id', 'nama'] // Ambil hanya id dan nama
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
// const getQuizByPostId = async (req, res) => {
//   const postId = parseInt(req.params.postId);

//   try {
//     const quizMap = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }; // Mapping postId ke quizId
//     const quizId = quizMap[postId];

//     if (!quizId) {
//       return res.status(404).json({ error: 'Kuis tidak ditemukan untuk postId ini' });
//     }

//     // Ambil quiz berdasarkan quizId
//     const quiz = await Wisata.findByPk(quizId);

//     if (!quiz) {
//       return res.status(404).json({ error: 'Kuis tidak ditemukan' });
//     }

//     // Ambil pertanyaan yang terkait dengan quizId tertentu
//     const questions = await Question.findAll({
//       where: { quizId: quizId } // Filter berdasarkan quizId
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ error: 'Pertanyaan kuis tidak ditemukan' });
//     }

//     // Kirimkan hasil kuis dengan pertanyaan yang sesuai
//     res.json({
//       quizId: quiz.id,
//       questions: questions.map(q => ({
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
const getQuizByPostId = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    // Cari quiz berdasarkan postId di tabel Wisata
    const quiz = await Wisata.findByPk(postId);

    if (!quiz) {
      return res.status(404).json({ error: 'Kuis tidak ditemukan untuk postId ini' });
    }

    // Ambil pertanyaan berdasarkan quizId
    const questions = await Question.findAll({
      where: { quizId: postId } // karena quizId disamakan dengan postId
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'Pertanyaan kuis tidak ditemukan' });
    }

    // Fungsi bantu: parse hanya jika bentuknya string
    const parseOptions = (options) => {
      try {
        return typeof options === 'string' ? JSON.parse(options) : options;
      } catch (e) {
        console.error('Gagal parsing options:', options);
        return {};
      }
    };

    // Kirimkan response
    res.json({
      quizId: quiz.id,
      questions: questions.map(q => ({
        questionId: q.questionId,
        text: q.text,
        options: parseOptions(q.options)
      }))
    });

  } catch (err) {
    console.error('Error in getQuizByPostId:', err);
    res.status(500).json({ error: 'Gagal mengambil kuis' });
  }
};



// Membuat kuis dan menyimpan pertanyaan ke database
const createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Title and questions are required' });
  }

  try {
    // Buat quiz baru
    const quiz = await Quiz.create({ title });

    // Tambahkan pertanyaan ke dalam kuis
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        return await Question.create({
          text: q.text,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          quizId: quiz.id
        });
      })
    );

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: {
        id: quiz.id,
        title: quiz.title,
        questions: createdQuestions.map(q => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options),
          correctAnswer: q.correctAnswer
        }))
      }
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
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
// const submitQuiz = async (req, res) => {
//   const { quizId, answers, name } = req.body;

//   try {
//     // Ambil quiz berdasarkan quizId
//     const quiz = await Wisata.findByPk(quizId);

//     if (!quiz) {
//       return res.status(404).json({ error: 'Quiz tidak ditemukan' });
//     }

//     // Ambil pertanyaan yang terkait dengan quizId
//     const questions = await Question.findAll({
//       where: { quizId: quizId } // Filter berdasarkan quizId
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ error: 'Tidak ada pertanyaan dalam kuis ini' });
//     }

//     let correctCount = 0;
//     let results = [];

//     // Mengevaluasi jawaban user untuk setiap pertanyaan
//     questions.forEach((question) => {
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

//     const scorePercentage = (correctCount / questions.length) * 100;

//     const response = {
//       certificateEligible: scorePercentage >= 90,
//       score: scorePercentage,
//       totalQuestions: questions.length,
//       results
//     };

//     // Jika pengguna memenuhi syarat untuk mendapatkan sertifikat, buat sertifikat
//     if (scorePercentage >= 90) {
//       const courseName = quiz.nama;
//       const downloadUrl = `/api/posts/certificate?name=${encodeURIComponent(name)}&course=${encodeURIComponent(courseName)}`;
    
//           // Jika pengguna memenuhi syarat untuk mendapatkan sertifikat, buat sertifikat
//     // if (scorePercentage >= 90) {
//     //   const courseName = quiz.nama;
//     //   return generateCertificateWithBackgroundBackend(req, res, name, courseName);
//     // }
//       return res.json({
//         certificateEligible: true,
//         nametour: quiz.nama,
//         quizId: quiz.id,
//         score: scorePercentage,
//         totalQuestions: questions.length,
//         results,
//         certificateDownloadUrl: downloadUrl
//       });
//       // res.json(response);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Gagal memproses kuis' });
//   }
// };
const submitQuiz = async (req, res) => {
  const { quizId, answers, name } = req.body;

  try {
    const quiz = await Wisata.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz tidak ditemukan' });
    }

    const questions = await Question.findAll({
      where: { quizId },
      order: [['questionId', 'ASC']]
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'Tidak ada pertanyaan dalam kuis ini' });
    }

    let correctCount = 0;
    const results = questions.map(q => {
      const userAnswer = answers[q.questionId]; // pakai questionId
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: q.questionId,
        questionText: q.text,
        userAnswer: userAnswer || null,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const scorePercentage = (correctCount / questions.length) * 100;

    const response = {
      certificateEligible: scorePercentage >= 90,
      score: scorePercentage,
      totalQuestions: questions.length,
      results
    };

    if (scorePercentage >= 90) {
      const courseName = quiz.nama;
      const downloadUrl = `/api/posts/certificate?name=${encodeURIComponent(name)}&course=${encodeURIComponent(courseName)}`;

      return res.json({
        ...response,
        nametour: quiz.nama,
        quizId: quiz.id,
        certificateDownloadUrl: downloadUrl
      });
    }

    return res.json(response);

  } catch (err) {
    console.error('Error in submitQuiz:', err);
    return res.status(500).json({ error: 'Gagal memproses kuis' });
  }
};


const getCertificate = async (req, res) => {
  const { name, course } = req.query;
  return generateCertificateWithBackgroundBackend(req, res, name, course);
};

module.exports = { getQuizByPostId, submitQuiz, getAllQuizzes, getCertificate, createQuiz };
