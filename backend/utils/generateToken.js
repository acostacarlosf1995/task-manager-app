const jwt = require('jsonwebtoken');
const router = require("../routes/userRoutes");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

module.exports = generateToken;
