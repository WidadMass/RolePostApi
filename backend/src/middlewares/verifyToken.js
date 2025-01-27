const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token manquant. Accès refusé.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Inclut l'utilisateur dans req.user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};
