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

    page.drawText(name, {
      x: 100 * 9 , // Kiri kanan
      y: 750, // Atas bawah
      font,
      size: recipientNameFontSize,
      color: textColor,
    });

    page.drawText(course, {
      x: pageWidth / 2 - (courseNameFontSize * course.length) / 3,
      y: pageHeight * 0.6,
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