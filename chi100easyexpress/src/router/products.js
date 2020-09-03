const express = require("express");
var short = require('short-uuid');

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
        price: req.body.price,
        currency: req.body.currency,
        productIdentifier: short.generate(),
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

router.put('/:id', async(req, res) => {

    console.log('product to update', req.body);

    const product = {
        name: req.body.name,
        price: req.body.price,
        currency: req.body.currency,
    };

    try {
        const saved = await db.actions.products.updateOne2(req.params.id, product);
        console.log('updated product', saved);
        res.json(saved);

    } catch (error) {
        console.log(error);
        res.json({
            message: error
        });
    }
});


module.exports = router;
