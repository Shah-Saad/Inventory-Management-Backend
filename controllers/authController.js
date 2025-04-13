const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT with role and id
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },  // These will be decoded and available in authMiddleware
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

module.exports = {
    signup: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const existing = await User.findOne({ where: { email } });
            if (existing) {
                return res.status(409).json({ success: false, message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword, role });

            const token = generateToken(user);

            return res.status(201).json({
                success: true,
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = generateToken(user);

            return res.status(200).json({
                success: true,
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
};
