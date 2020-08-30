const express = require("express");
const uuidv4 = require('uuid/v4');
const router = express.Router();

const db = require('../model');

router.get('/', async(req, res) => {
    try {
        const order = await db.actions.products.findAll();
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

router.post('/', async(req, res) => {

    const product = {
        name: req.body.name,
        productIdentifier: uuidv4().toString(),
        price: req.body.price,
    };

    try {
        const saved = await db.actions.products.create(product);
        console.log("created product", saved);
        res.json(saved);

    } catch (error) {
        res.json({
            message: error
        });
    }
});

module.exports = router;
