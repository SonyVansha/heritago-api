const jwt = require('jsonwebtoken');

const activeTokens = new Set();

const authenticateToken = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    if (!activeTokens.has(token)) {
        return res.status(401).json({ message: 'Token tidak valid atau sudah logout' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak sah' });
        }
        req.user = user;
        next();
    });
};

// const verifyToken = (req, res, next) => {
//     const authHesader = req.headers.authorization;
  
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Token tidak tersedia' });
//     }
  
//     const token = authHeader.split(' ')[1];
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (err) {
//       return res.status(403).json({ message: 'Token tidak valid atau sudah expired' });
//     }
//   };
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
};
  

const addActiveToken = (token) => {
    activeTokens.add(token);
};

const removeActiveToken = (token) => {
    activeTokens.delete(token);
};

module.exports = { authenticateToken, addActiveToken, removeActiveToken, isAdmin, verifyToken };
