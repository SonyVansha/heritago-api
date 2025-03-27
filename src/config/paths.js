const path = require("path");

const BASE_DIR = path.join(__dirname, "..");
const CERTIFICATE_DIR = path.join(BASE_DIR, "public", "certificates");
const TEMPLATE_IMAGE = path.join(BASE_DIR, "public", "img", "template.png");
const FONT_PATH = path.join(BASE_DIR, "public", "fonts", "Montserrat-ExtraBold.ttf");

module.exports = { CERTIFICATE_DIR, TEMPLATE_IMAGE, FONT_PATH };
