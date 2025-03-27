const express = require("express");
const { getTour, addTour, deleteTour, getTourbyId } = require("../controllers/tourController");
const router = express.Router();


router.get("/tour", getTour);
router.get("/tour/:id", getTourbyId);
router.post("/addtour", addTour);
router.delete("/tour/:id", deleteTour);

module.exports = router;