const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const fs = require('fs');
const router = express.Router();
const shared = require('./shared');


// router.post('/shareDocument', (req, res) => {
//     console.log('req', req.files);
//
//     const {file} = req.files;
//     const {name, data, size, mimetype, md5, tempFilePath} = file;
//
//     const caption = req.body.caption;
//
//     const fileName = `/tmp/${new Date().getTime()}-${name}`;
//     file.mv(fileName, async (err) => {
//         const chatId = req.body.chatId;
//
//         const f = await fs.createReadStream(fileName);
//
//         console.log('tmp file is ', f);
//
//         const form = new FormData();
//         form.append('document', data, {
//             filename: name,
//             contentType: 'application/pdf',
//             knownLength: size,
//         });
//         form.append('chat_id', chatId);
//         if (caption) {
//             form.append('caption', caption);
//         }
//
//         console.log(form);
//
//         axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, form, {
//             headers: form.getHeaders()
//         }).then(response => {
//
//             console.log('sending document was success!!!!');
//
//             const wayForPayAPI = 'https://api.wayforpay.com/api';
//             const merchantSecretKey = 'e41d4cb261a4fe6a328acf27c0d61fa7f320a6a8';
//
//             const params = {
//                 transactionType: 'CREATE_QR',
//                 merchantAccount: 'freelance_user_5f44fcec40c51',
//                 merchantAuthType: 'SimpleSignature',
//                 merchantDomainName: 'www.chystoprosto.com',
//                 merchantSignature: '',
//                 apiVersion: 1,
//                 serviceUrl: 'https://agafonov.tech/payment',
//                 orderReference: '123456789-3',
//                 orderDate: new Date().getTime(),
//                 amount: 100.87,
//                 currency: 'UAH',
//                 productName: ['Шорты'],
//                 productPrice: [100.87],
//                 productCount: [1],
//             };
//
//             const paramsForSig = `${params.merchantAccount};${params.merchantDomainName};${params.orderReference};${params.orderDate};${params.amount};${params.currency};${params.productName[0]};${params.productCount[0]};${params.productPrice[0]}`;
//             console.log('paramsForSig', paramsForSig);
//
//             const hmac = crypto.createHmac('md5', merchantSecretKey);
//             hmac.update(paramsForSig, 'utf8');
//
//             params.merchantSignature = hmac.digest('hex');
//
//             console.log('params', params);
//
//             axios.post(`${wayForPayAPI}`, params, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }).then((wayforpayres) => {
//                 console.log(wayforpayres.data);
//
//                 const { reason, reasonCode, imageUrl } = wayforpayres.data;
//
//                 console.log(reason);
//                 console.log(reasonCode);
//                 console.log(imageUrl);
//
//                 if (reason === 'Ok') {
//
//                     console.log('reason is ok');
//
//                     const form = new FormData();
//                     form.append('photo', imageUrl);
//                     form.append('chat_id', chatId);
//                     form.append('caption', 'QR на оплату');
//
//                     axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, form, {
//                         headers: form.getHeaders()
//                     }).then(response => {
//
//                         console.log('sending QR was success!!!!');
//
//                     }).catch(error => {
//                         console.log(error);
//                     });
//                 } else {
//                     return res.json({
//                         message: 'ERROR',
//                         error: wayforpayres.data,
//                     });
//                 }
//
//             }).catch(error => {
//                 return res.json({
//                     message: 'ERROR',
//                     error,
//                 });
//             });
//
//             return res.json({
//                 message: 'OK',
//             });
//
//         }).catch(error => {
//             return res.json({
//                 message: 'ERROR',
//                 error,
//             });
//         });
//
//     });
// });

router.post('/confirmDocument', (req, res) => {
    axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: req.body.chat_id,
        text: `Пожалуйста подтвердите или отмените заказ №${req.body.externalOrderId} ...`,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: 'Подтвердить', callback_data: JSON.stringify({
                        order_id: req.body.order_id,
                        action: 'confirm'
                })},
                { text: 'Отменить', callback_data: JSON.stringify({
                        order_id: req.body.order_id,
                        action: 'decline'
                })}
            ]],
            resize_keyboard: true,
        }
    }).then(response => {
        console.log(response.data);
        res.json({
            ok: true,
            payload: response.data,
        });
    }).catch(error => {
        console.error(error);
        res.json({
            ok: false,
            error,
        });
    });
});

module.exports = router;
