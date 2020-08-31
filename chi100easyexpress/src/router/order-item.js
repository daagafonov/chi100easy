const express = require("express");
const router = express.Router();

const db = require('../model');

router.get('/:id', async(req, res) => {
    try {
        const order = await db.actions.orderItem.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.post('/order/:id', async(req, res) => {
    try {
        const saved = await db.actions.orderItem.create({
            count: req.body.count,
            creation_dt: req.body.creation_dt,
        });
        const updatedUser = await db.actions.orderItem.addItemToOrder(req.params.id, saved);
        res.json(saved);
    } catch (error) {
        res.error(500).json({
            message: error
        });
    }
});

module.exports = router;
