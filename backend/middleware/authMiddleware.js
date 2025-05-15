const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'No authorization, user not found' });
            }

            next();
        } catch (error) {
            console.error('Middleware error authentication (invalid toker/expired):', error.name, error.message);
            return res.status(401).json({ message: 'No authorization, token fail' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No authorization, token not found or invalid format' });
    }
}

module.exports = { protect };