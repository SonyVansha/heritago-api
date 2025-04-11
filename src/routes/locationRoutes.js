const express = require('express');
const { locationsNearby } = require('../controllers/locationController');
const router = express.Router();

router.post("/nearby", locationsNearby);

module.exports = router;