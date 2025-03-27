const express = require("express");
const { getTour, addTour, deleteTour } = require("../controllers/tourController");
const router = express.Router();


router.get("/tour", getTour);
router.post("/addtour", addTour);
router.delete("/tour/:id", deleteTour);

module.exports = router;