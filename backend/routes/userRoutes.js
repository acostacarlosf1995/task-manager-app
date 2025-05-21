const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const {validate} = require('../middleware/validationMiddleware');
const {registerUser, loginUser} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

const registerValidationRules = [
    body('name')
        .trim()
        .not().isEmpty().withMessage('Please add a name')
        .isLength({min: 2}).withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .not().isEmpty().withMessage('The email is mandatory')
        .isEmail().withMessage('Please add a valid email')
        .normalizeEmail(),
    body('password')
        .not().isEmpty().withMessage('The password is mandatory')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters')
];

const loginValidationRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('The email is mandatory')
        .isEmail().withMessage('Please add a valid email'),
    body('password')
        .not().isEmpty().withMessage('The password is mandatory')
];

router.post('/register', registerValidationRules, validate, registerUser);

router.post('/login', loginValidationRules, validate, loginUser);

router.get('/profile', protect, (req, res, next) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        })
    } else {
        res.status(404);
        return next(new Error('User not found'));
    }
});

module.exports = router;