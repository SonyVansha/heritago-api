const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { User } = require('../models/userModel');
const User = require('../models/userModel');
const { addActiveToken, removeActiveToken } = require('../middlewares/authMiddleware');

// Simpan token aktif
// let activeTokens = new Set();

// Register User
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role !== 'user' && role !== 'admin') {
            return res.status(400).json({ message: 'Role hanya boleh user atau admin' });
        }
        await User.create({ username, password: hashedPassword, role });

        res.json({ message: 'Registrasi berhasil' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username sudah digunakan' });
        } else {
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
};

// login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || "1h"; 
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn });

        addActiveToken(token); // Simpan token ke daftar aktif
        // res.cookie('token', token, { httpOnly: true, secure: true });
        res.json({ message: 'Login berhasil', token, role: user.role });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    // Hapus token dari daftar aktif
    removeActiveToken(token); 
    res.clearCookie('token');
    res.json({ message: 'Logout berhasil' });
};

// Verifikasi User
// const verifyUser = async (req, res) => {
//     res.json({ message: 'Anda masih login', user: { username: req.user.username, role: req.user.role } });
// };
const verifyUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
  
      res.json({
        message: 'Token valid, user terverifikasi',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Verifikasi error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  };

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await modelUser.getAll();
    res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      const success = await modelUser.delete(id);
      if (success) {
          res.json({ message: 'User berhasil dihapus' });
      } else {
          res.status(404).json({ message: 'User tidak ditemukan' });
      }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, deleteUser, logoutUser, verifyUser };