const { generateCertificate, verifyCertificate } = require("../services/certificateService");
const path = require("path");
const { CERTIFICATE_DIR } = require("../config/paths");

// Create certificate handler
const createCertificate = async (req, res) => {
    try {
        const { name, course, date } = req.body;
        const result = await generateCertificate(name, course, date);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Download certificate handler
const downloadCertificate = (req, res) => {
    const filePath = path.join(CERTIFICATE_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: "Sertifikat tidak ditemukan." });
    }
};

// Verify certificate handler
const verifyCertificateHandler = (req, res) => {
    const { name, course } = req.query;
    const result = verifyCertificate(name, course);
    res.json(result);
};

module.exports = { createCertificate, downloadCertificate, verifyCertificateHandler };
