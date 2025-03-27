const express = require("express");
const router = express.Router();
const { createCertificate, downloadCertificate, verifyCertificateHandler } = require("../controllers/certificateController");

router.post("/generate-certificate", createCertificate);
router.get("/certificates/:filename", downloadCertificate);
router.get("/verify", verifyCertificateHandler);

module.exports = router;
