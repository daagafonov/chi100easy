const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');

const db = require('../model');

const urlencodedParser = bodyParser.urlencoded({ extended: true });

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

    console.log('response', result);

    res.status(200).json(result);

});

module.exports = router;
