const jwt = require('jsonwebtoken');

// const secretKey = process.env.JWT_SECRET;
const secretKey = "secret"
const blacklistedTokens = new Set();

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  if (blacklistedTokens.has(token)) {
      return res.status(403).json({ message: 'Token has been revoked' });
  }

  jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
  });
}


function blacklistToken(token) {
  blacklistedTokens.add(token);
}

module.exports = { authenticateToken, blacklistToken };