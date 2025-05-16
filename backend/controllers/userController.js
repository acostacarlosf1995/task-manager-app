const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const router = require("../routes/userRoutes");

const registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: 'User registered successfully'
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // if (!email || !password) {
        //     res.status(400);
        //     throw new Error('Please add email and password');
        // }

        const user = await User.findOne({email}).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                message: 'User login successfull',
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
};