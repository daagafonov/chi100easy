const express = require("express");
const router = express.Router();
const short = require('short-uuid');
const fs = require('fs');

const db = require('../model');

const order = require('../model/Order');

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

        console.log('files', req.files);

        const { name, mimetype } = req.files.file;

        const saved = await db.actions.order.create({
            comment: req.body.comment,
            user: req.params.userId,
            orderId: short.generate(),
            //file: req.files.file,
            finalCost: req.body.finalCost,
        });

        const fileName = `/tmp/${new Date().getTime()}-${name}`;

        await req.files.file.mv(fileName, async (error) => {

            const imageData = fs.readFileSync(fileName);

            await db.actions.order.updateOne(saved._id, {
                documentType: mimetype,
                documentData: imageData,
            });

            res.json({
                message: 'OK'
            });

        });
    } catch (error) {
        console.log('error', error);
        res.json({
            message: error
        });
    }
});

router.put('/:id', async(req, res) => {

    const order = {
        comment: req.body.comment,
        updated_dt: new Date(),
    };

    try {
        const saved = await db.actions.order.updateOne(req.params.id, order);
        console.log(saved);
        res.json(saved);
    } catch (error) {
        res.json({
            message: error
        });
    }
});

module.exports = router;
