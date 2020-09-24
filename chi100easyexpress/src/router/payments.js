const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: true });

router.post('/wayforpayservice', urlencodedParser, (req, res) => {

    var body = '';

    Object.getOwnPropertyNames(req.body).forEach((val, ndx, array) => {
        try {
            body = JSON.parse(val + '""}');
            console.log('payment info', body);
        } catch(error) {
            console.error(error);
        }
    });

    // {
    //     merchantAccount: 'freelance_user_5f44fcec40c51',
    //         orderReference: 'akwAGags1cF6H3Wyy28NvA',
    //     merchantSignature: '024f067a83f60992fa2988f763e7c507',
    //     amount: 55,
    //     currency: 'UAH',
    //     authCode: '',
    //     email: null,
    //     phone: null,
    //     createdDate: 1600940096,
    //     processingDate: 1600941040,
    //     cardPan: '',
    //     cardType: null,
    //     issuerBankCountry: null,
    //     issuerBankName: null,
    //     recToken: '',
    //     transactionStatus: 'Refunded',
    //     reason: 'Ok',
    //     reasonCode: 1100,
    //     fee: 0,
    //     paymentSystem: 'googlePay',
    //     acquirerBankName: 'WayForPay',
    //     cardProduct: 'debit',
    //     clientName: null,
    //     products: ''
    // }

    const merchantSecretKey = 'e41d4cb261a4fe6a328acf27c0d61fa7f320a6a8';
    const hmac = crypto.createHmac('md5', merchantSecretKey);

    const result = {
        orderReference: body.orderReference,
        status: 'accept',
        time:new Date().getTime()
    };

    const paramsForSig = `${result.orderReference};${result.status};${result.time}`;
    hmac.update(paramsForSig, 'utf8');

    result.signature = hmac.digest('hex');

    console.log('response', result);

    res.status(200).json(result);
});

module.exports = router;