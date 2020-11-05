const express = require("express");
const router = express.Router();

const db = require('../model');

const utils = require('./utils');

router.get('/user/:userId', async (req, res) => {
    try {
        const addresses = await db.actions.userAddress.findByUserId(req.params.userId);
        res.json(addresses);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const address = await db.actions.userAddress.getAddressWithPopulateUser(req.params.id);
        if (address) {
            res.json(address);
        } else {
            utils.resNotFound(res, 'not found');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.actions.userAddress.delete(req.params.id);
        res.json({
            ok: true,
            message: result
        });
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/user/:userId', async (req, res) => {
    try {

        const saved = await db.actions.userAddress.create({
            user: req.params.userId,
            address: req.body.address,
        });

        res.json({
            ok: true,
            message: 'OK',
            address: saved,
        });
    } catch (error) {
        console.log('error', error);
        utils.resError(res, error);
    }
});

module.exports = router;
