const jwt = require('jsonwebtoken');
const db = require('../models'); // Sequelize models
const User = db.users;

const blacklist = new Set();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(403).json({ success: false, message: "No token provided!" });
        }

        if (blacklist.has(token)) {
            return res.status(401).json({ success: false, error: 'Token has been invalidated' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Unauthorized!" });
            }

            // Optional: Attach full user info to req
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            req.user = {
                id: user.id,
                role: user.role,
                email: user.email
            };

            next();
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Optional: Role-checking middleware for cleaner routes
const isRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

const authJwt = {
    verifyToken,
    blacklist,
    isRole
};

module.exports = authJwt;
