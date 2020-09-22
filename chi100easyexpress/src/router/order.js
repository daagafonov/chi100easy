const express = require("express");
const router = express.Router();
const short = require('short-uuid');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');

const db = require('../model');

router.get('/user/:userId', async(req, res) => {
    try {
        const orders = await db.actions.order.findByUserId(req.params.userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
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
        res.status(500).json({
            message: error
        });
    }
});

router.post('/user/:userId', async(req, res) => {
    try {

        console.log('files', req.files);

        const { name, mimetype, size, md5 } = req.files.file;

        const saved = await db.actions.order.create({
            comment: req.body.comment,
            user: req.params.userId,
            internalOrderId: short.generate(),
            externalOrderId: req.body.externalOrderId,
            finalCost: req.body.finalCost,
        });

        const fileNameWOPath = `${new Date().getTime()}-${name}`;
        const fileName = `/tmp/${fileNameWOPath}`;

        await req.files.file.mv(fileName, async (error) => {


            // const writestream = gfs.createWriteStream({
            //     filename: name + Date.now(),
            //     mode: 'w',
            //     content_type: mimetype,
            //     metadata: req.body
            // });
            // fs.createReadStream(fileName).pipe(writestream);
            // writestream.on('close', (file) => {
            //
            //     console.log(file);
            //     //res.status(200).json(file);
            // });

            const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                chunkSizeBytes: 1024,
                bucketName: 'documents'
            });

            fs.createReadStream(fileName).
                pipe(gridfs.openUploadStream(saved._id)).
                on('error', function (error) {
                    console.log(error);
                }).
                on('finish', async () => {
                    console.log('done!');
                    await db.actions.order.updateOne(saved._id, {
                        document: doc._id,
                    });

                    res.json({
                        message: 'OK'
                    });
                });

            // const imageData = fs.readFileSync(fileName);

            // const doc = await db.actions.document.create({
            //     type: mimetype,
            //     data: imageData,
            //     size,
            //     md5,
            // });

            // await db.actions.order.updateOne(saved._id, {
            //     document: doc._id,
            // });



        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
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
        res.status(500).json({
            message: error
        });
    }
});

router.post('/:orderId/send', async (req, res)=>{
    try {
        const order = await db.actions.order.getOrderWithPopulateDocument(req.params.orderId);
        console.log('order %o', order);

        const { document } = order;

        console.log(document);

        console.log('creating form');
        const form = new FormData();
        console.log('creating data');
        form.append('document', document.data, {
            filename: document.name,
            contentType: document.type,
            knownLength: document.size,
        });
        console.log('creating chat_id');
        form.append('chat_id', order.user.telegramUserId);
        // if (caption) {
        console.log('creating caption');
        form.append('caption', 'Please confirm an order');
        // }

        console.log(form);

        await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, form, {
            headers: form.getHeaders()
        }).then(response => {

            console.log(response);

        }).catch((error) => {
            console.error(error);
            res.status(500).json({
                message: error
            });
        });

    } catch(error) {
        res.status(500).json({
            message: error
        });
    }
});

module.exports = router;
