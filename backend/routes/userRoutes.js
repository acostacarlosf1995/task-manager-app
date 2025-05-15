const express = require('express');
const router = express.Router();
const { registerUser, loginUser} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        })
    } else {
        res.status(401);
        throw new Error('User not found');
    }
});

module.exports = router;