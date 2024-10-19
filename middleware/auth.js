// /src/middleware/auth.js

const jwt = require('jsonwebtoken');
const {JWT_SECRET } = require('../constants/constants')


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Access denied');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
