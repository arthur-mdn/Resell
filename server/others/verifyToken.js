const jwt = require("jsonwebtoken");
const config = require('./config');

const verifyToken = (req, res, next) => {
    const token = req.cookies['resell_session_token'];
    if (!token) {
        return res.status(403).send('Un token est requis pour l\'authentification');
    }
    try {
        req.user = jwt.verify(token, config.secretKey);
    } catch (err) {
        return res.status(401).send('Token invalide');
    }
    return next();
};

module.exports = verifyToken;