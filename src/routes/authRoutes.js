const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser, logoutUser, verifyUser } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', authenticateToken, verifyUser);
router.post('/logout', authenticateToken, logoutUser);

module.exports = router;
