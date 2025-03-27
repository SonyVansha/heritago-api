const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { CERTIFICATE_DIR, TEMPLATE_IMAGE, FONT_PATH } = require("../config/paths");

// Buat direktori sertifikat jika belum ada
if (!fs.existsSync(CERTIFICATE_DIR)) {
    fs.mkdirSync(CERTIFICATE_DIR, { recursive: true });
}

// Fungsi untuk membuat sertifikat
const generateCertificate = async (name, course, date) => {
    return new Promise(async (resolve, reject) => {
        if (!name || !course || !date) {
            return reject(new Error("Nama, kursus, dan tanggal diperlukan."));
        }

        const filename = `${name.replace(/ /g, "_")}_certificate.pdf`;
        const filePath = `${CERTIFICATE_DIR}/${filename}`;
        const verificationURL = `http://localhost:5000/verify?name=${encodeURIComponent(name)}&course=${encodeURIComponent(course)}`;

        try {
            // Buat QR Code
            const qrCodeBuffer = await QRCode.toBuffer(verificationURL);

            // Generate PDF Sertifikat
            const doc = new PDFDocument({ size: "A4", layout: "landscape" });
            doc.registerFont("Montserrat-ExtraBold", FONT_PATH);
            doc.pipe(fs.createWriteStream(filePath));

            // Tambahkan gambar template
            doc.image(TEMPLATE_IMAGE, 0, 0, { width: 842, height: 595 });

            // Tambahkan Nama
            const pageWidth = doc.page.width;
            const textHeight = doc.fontSize(32).heightOfString(name, { width: pageWidth });
            const textY = (doc.page.height - textHeight) / 2;

            doc.fontSize(32).font("Montserrat-ExtraBold").fillColor("#004aad").text(name, { align: "center", width: pageWidth, y: textY });

            // Tambahkan QR Code
            doc.image(qrCodeBuffer, 700, 400, { width: 100 });

            doc.end();

            resolve({ message: "Sertifikat berhasil dibuat", url: `/certificates/${filename}` });
        } catch (error) {
            reject(error);
        }
    });
};

// Fungsi untuk memverifikasi sertifikat
const verifyCertificate = (name, course) => {
    if (!name || !course) {
        return { error: "Parameter tidak lengkap." };
    }

    const certPath = `${CERTIFICATE_DIR}/${name.replace(/ /g, "_")}_certificate.pdf`;

    if (fs.existsSync(certPath)) {
        return { message: "Sertifikat valid", name, course, status: "VALID" };
    } else {
        return { message: "Sertifikat tidak ditemukan", name, course, status: "TIDAK VALID" };
    }
};

module.exports = { generateCertificate, verifyCertificate };
