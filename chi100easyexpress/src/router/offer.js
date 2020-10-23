const express = require("express");
const router = express.Router();
const short = require('short-uuid');
const fs = require('fs');
const axios = require('axios');

const mongoose = require('mongoose');
const crypto = require('crypto');

const db = require('../model');

const utils = require('./utils');

const { confirmDocument } = require('./botUtils');
const { sendDocument} = require('./telegramUtils');

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

        if (order.status === 'SENT') {

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
            utils.resStatusError(200, res, 'Document is not in a SENT status!');
        }
    } catch (error) {
        utils.resError(res, error);
    }
});

router.post('/:orderId/decline', async (req, res) => {
    try {
        const order = await db.actions.order.findById(req.params.orderId);
        if (order.status === 'SENT') {
            await db.actions.order.updateOne(req.params.orderId, {
                status: 'DECLINED'
            });
            return res.json({
                ok: true
            });
        } else {
            return utils.resStatusError(200, res, 'Document is not in a SENT status!');
        }
    } catch (error) {
        return utils.resError(res, error);
    }
});

router.post('/:orderId/send', async (req, res) => {
    try {
        const order = await db.actions.order.getOrderWithPopulateDocument(req.params.orderId);

        if (order.status !== 'CREATED') {
            return utils.resStatusError(400, res, 'Order was already sent');
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

                sendDocument(order, content).then(response => {

                    const {ok, result} = response.data;

                    if (ok) {

                        const { message_id, chat, document } = result;

                        confirmDocument(message_id, chat, document, order).then(async response => {

                            await db.actions.order.updateOne(order._id, {
                                status: 'SENT'
                            });

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
                        return utils.resError(res, 'sendDocument was not ok');
                    }

                }).catch((error) => {
                    console.error(error);
                    return utils.resError(res, error);
                });
            });

    } catch (error) {
        return utils.resError(res, error);
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
        success(wayforpayres.data);
    }).catch(err => {
        error(err);
    });
}

module.exports = router;
