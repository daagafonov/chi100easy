const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');

const db = require('../model');
const { confirmPaymentIsDone } = require('./telegramUtils');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
// const jsonParser = bodyParser.json();

router.post('/wayforpayservice', urlencodedParser, async (req, res) => {

    var body = '';

    Object.getOwnPropertyNames(req.body).forEach((val, ndx, array) => {
        try {
            body = JSON.parse(val + '""}');
            console.log('payment info', body);
        } catch (error) {
            console.error(error);
        }
    });

    try {
        const payment = await db.actions.payment.create({
            merchantAccount: body.merchantAccount,
            orderReference: body.orderReference,
            amount: body.amount,
            currency: body.currency,
            authCode: body.authCode,
            email: body.email,
            phone: body.phone,
            createdDate: body.createdDate,
            processingDate: body.processingDate,
            cardPan: body.cardPan,
            cardType: body.cardType,
            issuerBankCountry: body.issuerBankCountry,
            issuerBankName: body.issuerBankName,
            recToken: body.recToken,
            transactionStatus: body.transactionStatus,
            reason: body.reason,
            reasonCode: body.reasonCode,
            fee: body.fee,
            paymentSystem: body.paymentSystem,
            acquirerBankName: body.acquirerBankName,
            cardProduct: body.cardProduct,
            clientName: body.clientName,
        });

        if (body.transactionStatus === 'Approved') {
            const orders = await db.actions.order.findBy({
                internalOrderId: body.orderReference,
            });

            const order = orders[0];

            await db.actions.order.updateOne(order._id, {
                status: 'PAID',
            });

            const response = await confirmPaymentIsDone(order.user.telegramUserId, `Заказ №${order.externalOrderId} оплачен.`);
            console.log(response.data);

            await db.actions.user.updateOne2(order.user._id, {
                bonus: (order.user.bonus + body.amount * 0.01),
            });

        } else if (body.transactionStatus === 'Refunded') {
            const order = await db.actions.order.findBy({
                internalOrderId: body.orderReference,
            });
            await db.actions.order.updateOne(order._id, {
                status: 'REFUNDED',
            });
        }

    } catch(error) {
        console.error(error);
    }

    const merchantSecretKey = process.env.WAYFORPAY_MERCHANT_SECRET_KEY;
    const hmac = crypto.createHmac('md5', merchantSecretKey);

    const result = {
        orderReference: body.orderReference,
        status: 'accept',
        time: new Date().getTime()
    };

    const paramsForSig = `${result.orderReference};${result.status};${result.time}`;
    hmac.update(paramsForSig, 'utf8');

    result.signature = hmac.digest('hex');

    res.status(200).json(result);

});

router.get('/', async (req, res) => {
    try {
        const payments = await db.actions.payment.find();
        res.json(payments);
    } catch (error) {
        console.error(error);
        utils.resError(res, error);
    }
});

module.exports = router;
