const express = require("express");
const router = express.Router();
const utils = require('./utils');
const verify = require('./verifyToken');
const db = require('../model');

router.get('/', verify, async (req, res) => {
    try {
        const users = await db.actions.user.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

router.get('/byTelegramUserId/:telegramUserId', verify, async(req, res) => {
    try {
        const user = await db.actions.user.getByTelegramUserId(req.params.telegramUserId);
        if (user) {
            res.json(user);
        } else {
            utils.resNotFound(res, 'does not exist');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.get('/:id', verify, async(req, res) => {
    try {
        const user = await db.actions.user.getWithPopulate(req.params.id);
        if (user) {
            res.json(user);
        } else {
            utils.resNotFound(res, 'does not exist');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/', async(req, res) => {

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        telegramUserId: req.body.telegramUserId,
        chatId: req.body.chatId,
    };

    try {
        const saved = await db.actions.user.create(user);
        console.log("create user", saved);
        res.json(saved);

    } catch (error) {
        utils.resError(res, error);
    }
});

router.put('/:id/phoneNumber', async(req, res, next) => {
    console.log(req.body);

    try {
        const updated = await db.actions.user.updateOne2(req.params.id, {
            phoneNumber: req.body.phoneNumber
        });
        console.log("updated phoneNumber", updated);
        res.json(updated);
    } catch (error) {
        utils.resError(res, error);
    }
});

router.put('/:id/location', async(req, res, next) => {
    try {
        const updated = await db.actions.user.updateOne2(req.params.id, {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });
        console.log("updated location", updated);
        res.json(updated);

    } catch (error) {
        utils.resError(res, error);
    }
});

router.put('/:id', async(req, res, next) => {
    try {
        const updated = await db.actions.user.updateOne2(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            telegramUserId: req.body.telegramUserId,
        });
        console.log("updated location", updated);
        res.json(updated);

    } catch (error) {
        utils.resError(res, error);
    }
});

router.delete('/:id', verify, async(req, res, next) => {
    utils.resError(res, 'Method is not supported yet');
});

module.exports = router;
