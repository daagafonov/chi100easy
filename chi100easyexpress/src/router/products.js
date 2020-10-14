const express = require("express");
const short = require('short-uuid');

const router = express.Router();

const db = require('../model');
const verify = require('./verifyToken');

router.get('/', verify, async(req, res) => {
    try {
        const order = await db.actions.product.findAll();
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

router.post('/query', verify, async(req, res) => {
    try {
        const order = await db.actions.product.findByQuery(req.body);
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

router.post('/', verify, async(req, res) => {

    const { name, price, externalIdentifier } = req.body;

    const product = {
        name,
        price,
        externalIdentifier,
        productIdentifier: short.generate(),
    };

    if (req.body.category) {
        product.category = req.body.category;
    }
    if (req.body.currency) {
        product.currency = req.body.currency;
    }

    try {
        const saved = await db.actions.product.create(product);
        console.log("created product", saved);
        res.json(saved);

    } catch (error) {
        res.json({
            message: error
        });
    }
});

router.put('/:id', verify, async(req, res) => {

    console.log('product to update', req.body);

    const { name, price } = req.body;

    const product = {
        name,
        price,
    };

    if (req.body.category) {
        product.category = req.body.category;
    }
    if (req.body.currency) {
        product.currency = req.body.currency;
    }

    try {
        const saved = await db.actions.product.updateOne2(req.params.id, product);
        console.log('updated product', saved);
        res.json(saved);

    } catch (error) {
        console.log(error);
        res.json({
            message: error
        });
    }
});

router.delete('/:id', verify, async (req, res) => {
    try {

        const result = await db.actions.product.delete(req.params.id);

        res.json({
            ok: true,
            message: result,
        });

    } catch(error) {
        console.log(error);
        res.json({
            message: error
        });
    }
});

module.exports = router;
