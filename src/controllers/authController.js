const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { User } = require('../models/userModel');
const modelUser = require('../models/user');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await modelUser.create({ username, password: hashedPassword });
      res.json({ message: 'Registrasi berhasil', user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }
  try {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Username atau password salah' });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.json({ message: 'Login berhasil', token });
  } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('token').json({ message: 'Logout berhasil' });
};

const verifyUser = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Anda belum login' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ message: 'Anda masih login', user: decoded });
  } catch (error) {
      res.status(401).json({ message: 'Token tidak valid' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await modelUser.getAll();
    res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}
};

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