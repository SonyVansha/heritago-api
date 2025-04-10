const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteUser, logoutUser, verifyUser } = require('../controllers/authController');
const { authenticateToken, verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', verifyToken, verifyUser);
router.post('/logout', authenticateToken, logoutUser);
router.delete('/user/:id', deleteUser); // err
module.exports = router;
