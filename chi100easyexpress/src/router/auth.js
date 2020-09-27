const router = require('express').Router();
const { resError } = require('./utils');
const db = require('../model');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('./validation');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return utils.resStatusError(400, res, error.details[0].message);
    }

    const emailExists = await db.LoginUser.findOne({
        email: req.body.email,
    });
    if (emailExists) {
        return res.status(400).json({
            ok: false,
            message: 'Email already exists',
        });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const user = await db.actions.loginUser.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
        });

        res.json({
            user: user._id,
        });
    } catch(error) {
        resError(res, error);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            ok: false,
            message: error.details[0].message,
        });
    }

    const user = await db.LoginUser.findOne({
        email: req.body.email,
    });
    if (!user) {
        return res.status(400).json({
            ok: false,
            message: 'Email is invalid',
        });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).json({
            ok: false,
            message: 'Password is invalid',
        });
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);

    res.json({
        ok: true,
    });
});

module.exports = router;
