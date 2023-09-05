const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    await body('username').notEmpty().withMessage('Username is required').run(req);
    await body('email').isEmail().withMessage("Invalid email format").run(req);
    await body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
    }

    const userExists = await User.findOne({
        $or: [{username}, {email}]
    });

    if (userExists) {
        res.status(400);
        throw new Error("Username or email is already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({message: 'User registered successfully'});
})

module.exports = {registerUser};
