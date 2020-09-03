const express = require("express");
const router = express.Router();

const db = require('../model');

router.get('/user/:userId', async(req, res) => {
    try {
        const orders = await db.actions.order.findByUserId(req.params.userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.json({
            message: error
        });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const order = await db.actions.order.getOrderWithPopulate(req.params.id);
        if (order) {
            res.json(order);
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

router.post('/user/:userId', async(req, res) => {
    try {
        const saved = await db.actions.order.create({
            comment: req.body.comment,
            user: req.params.userId,
        });
        // const order = await db.actions.order.addOrderToUser(req.params.userId, saved);
        console.log(saved);
        res.json(saved);
    } catch (error) {
        res.json({
            message: error
        });
    }
});

module.exports = router;
