const { getDBConnection } = require("../config/db");
const bcrypt = require('bcrypt');
const { blacklistToken } = require("../middlewares/authMiddleware");
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Replace with your actual secret key


// Register user

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const db = await getDBConnection();
      await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
      db.end();
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  
  const { username, password } = req.body;

    try {
      // Get a connection to the database
        const db = await getDBConnection();
        // Check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        // Close the database connection
        db.end();

        // If user does not exist, return an error
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        // Check if the password is correct
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        // If password is incorrect, return an error
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate a token
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        // If everything is ok, return the token
        res.json({ token });
    } catch (error) {
        // If an error occurs, return
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
  const token = req.headers['authorization'];
  if (token) {
      blacklistToken(token);
  }
  res.json({ message: 'Logout successful' });
};
module.exports = { login, logout, register };