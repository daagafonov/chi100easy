const express = require("express");
const router = express.Router();
const short = require('short-uuid');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');
const crypto = require('crypto');

const db = require('../model');

const utils = require('./utils');

router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await db.actions.order.findByUserId(req.params.userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await db.actions.order.getOrderWithPopulateUser(req.params.id);
        if (order) {
            res.json(order);
        } else {
            utils.resNotFound(res, 'not found');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/user/:userId', async (req, res) => {
    try {

        console.log('files', req.files);

        const {name, mimetype, size, md5} = req.files.file;

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

            const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                chunkSizeBytes: 1024,
                bucketName: 'documents'
            });

            fs.createReadStream(fileName).pipe(gridfs.openUploadStream(saved._id)).on('error', function (error) {
                res.json(utils.makeError(error));
            }).on('finish', async () => {
                console.log('upload was done!');
                const doc = await db.actions.document.create({
                    name,
                    type: mimetype,
                    size,
                    md5,
                });
                await db.actions.order.updateOne(saved._id, {
                    document: doc._id
                });

                res.json({
                    ok: true,
                    message: 'OK'
                });
            });

        });
    } catch (error) {
        console.log('error', error);
        utils.resError(res, error);
    }
});

router.put('/:id', async (req, res) => {

    const order = {
        comment: req.body.comment,
        updated_dt: new Date(),
    };

    try {
        const saved = await db.actions.order.updateOne(req.params.id, order);
        console.log(saved);
        res.json(saved);
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/:orderId/confirm', async (req, res) => {
    try {
        const order = await db.actions.order.findById(req.params.orderId);

        if (order.status === 'CREATED') {

            sendInvoice(order, async response => {

                await db.actions.order.updateOne(req.params.orderId, {
                    status: 'CONFIRMED'
                });

                res.json({
                    ok: true,
                    invoiceUrl: response.invoiceUrl,
                });

            }, err => {
                utils.resError(res, error);
            });
        } else {
            utils.resError(res, 'This document was already confirmed or declined');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/:orderId/decline', async (req, res) => {
    try {
        const order = await db.actions.order.findById(req.params.orderId);
        if (order.status === 'CREATED') {
            await db.actions.order.updateOne(req.params.orderId, {
                status: 'DECLINED'
            });
            res.json({
                ok: true
            });
        } else {
            utils.resError(res, 'document was already declined or confirmed');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/:orderId/send', async (req, res) => {
    try {
        const order = await db.actions.order.getOrderWithPopulateDocument(req.params.orderId);

        if (order.status !== 'CREATED') {
            utils.resError(res, 'Order was already sent');
            return;
        }

        const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 1024,
            bucketName: 'documents'
        });

        await gridfs.openDownloadStreamByName(order._id)
            .pipe(fs.createWriteStream(`/tmp/${order._id}`))
            .on('error', function (error) {
                utils.resError(res, error);
            })
            .on('finish', () => {
                const content = fs.readFileSync(`/tmp/${order._id}`);
                const form = new FormData();
                // console.log('creating data');
                form.append('document', content, {
                    filename: order.document.name,
                    contentType: order.document.type,
                    knownLength: order.document.size,
                });
                // console.log('creating chat_id');
                form.append('chat_id', order.user.telegramUserId);
                // if (caption) {
                // console.log('creating caption');
                // form.append('caption', 'Please confirm an order');

                // console.log(form);

                axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, form, {
                    headers: form.getHeaders()
                }).then(response => {

                    const {ok, result} = response.data;

                    console.log('ok typeof', typeof ok);

                    if (ok) {

                        console.log('result:', result);
                        const {message_id, chat, document} = result;

                        axios.post(`${process.env.BOT_SERVER_URI}/confirmDocument`, {
                            message_id: message_id,
                            chat_id: chat.id,
                            file_id: document.file_id,
                            file_unique_id: document.file_unique_id,
                            order_id: order._id,
                        }).then(response => {
                            console.log('conf doc succ');
                            res.status(200).json({
                                ok: true,
                                data: response.data,
                            });
                        }).catch(error => {
                            console.log('conf doc error');
                            utils.resError(res, error);
                        });

                        // send request to bot to display the buttons

                    } else {
                        utils.resError(res, 'sendDocument was not ok');
                    }

                }).catch((error) => {
                    console.error(error);
                    utils.resError(res, error);
                });
            });

    } catch (error) {
        utils.resError(res, error);
    }
});

function sendInvoice(order, success, error) {

    const wayForPayAPI = process.env.WAYFORPAY_API_URI;
    const merchantSecretKey = process.env.WAYFORPAY_MERCHANT_SECRET_KEY;

    const params = {
        transactionType: 'CREATE_INVOICE',
        merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
        merchantAuthType: 'SimpleSignature',
        merchantDomainName: process.env.DOMAIN_NAME,
        merchantSignature: '',
        apiVersion: 1,
        serviceUrl: process.env.WAYFORPAY_SERVICE_URI,
        orderReference: order.internalOrderId,
        orderDate: new Date().getTime(),
        amount: order.finalCost,
        currency: 'UAH',
        productName: ['Стирка белья'],
        productPrice: [order.finalCost],
        productCount: [1],
    };

    const paramsForSig = `${params.merchantAccount};${params.merchantDomainName};${params.orderReference};${params.orderDate};${params.amount};${params.currency};${params.productName[0]};${params.productCount[0]};${params.productPrice[0]}`;

    const hmac = crypto.createHmac('md5', merchantSecretKey);
    hmac.update(paramsForSig, 'utf8');

    params.merchantSignature = hmac.digest('hex');

    axios.post(`${wayForPayAPI}`, params, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((wayforpayres) => {
        const {reason, reasonCode, imageUrl} = wayforpayres.data;
        success(wayforpayres.data);
    }).catch(err => {
        error(err);
    });
}

module.exports = router;
