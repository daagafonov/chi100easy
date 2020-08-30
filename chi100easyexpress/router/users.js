const express = require("express");
const router = express.Router();

const db = require('../model');

router.get('/', async(req, res) => {
    try {
        const users = await db.User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.json({
            message: error
        });
    }
});

router.get('/byTelegramUserId/:telegramUserId', async(req, res) => {
    try {
        const user = await db.actions.user.getByTelegramUserId(req.params.telegramUserId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                error: true,
                message: 'does not exist'
            });
        }
    } catch (error) {
        res.json({
            message2: error
        });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const user = await db.actions.user.getWithPopulate(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                error: true,
                message: 'does not exist'
            });
        }
    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.post('/', async(req, res) => {

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        telegramUserId: req.body.telegramUserId
    };

    try {
        const saved = await db.userActions.create(user);//createUser(user);
        console.log("create user", saved);
        res.json(saved);

    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.put('/:id/phoneNumber', async(req, res, next) => {
    try {
        const updated = await db.User.updateOne({
            _id: req.params.id
        }, {
            $set: {
                phoneNumber: req.body.phoneNumber
            }
        });
        console.log("updated phoneNumber", updated);
        res.json(updated);
    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.put('/:id/location', async(req, res, next) => {
    try {
        const updated = await db.User.updateOne({
            _id: req.params.id
        }, {
            $set: {
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
        });
        console.log("updated location", updated);
        res.json(updated);

    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.delete('/:id', (req, res, next) => {
    res.json({
        message: "Method is not supported"
    });
});

module.exports = router;
