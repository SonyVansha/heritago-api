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

const addActiveToken = (token) => {
    activeTokens.add(token);
};

const removeActiveToken = (token) => {
    activeTokens.delete(token);
};

module.exports = { authenticateToken, addActiveToken, removeActiveToken };
