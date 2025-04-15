const express = require("express");
const { getTour, addTour, deleteTour, getTourbyId } = require("../controllers/tourController");
const upload = require("../middlewares/uploadImg");
const router = express.Router();


router.get("/tour", getTour);
router.get("/tour/:id", getTourbyId);
router.post("/addtour", upload.single("gambar"), addTour );
router.delete("/tour/:id", deleteTour);

module.exports = router;