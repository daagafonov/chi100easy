const express = require("express");
const router = express.Router();
const utils = require('./telegramUtils');

const db = require('../model');

router.post('/callme', (req, res) => {
    const {name, phone} = req.body;

    console.log('name=%s, phone=%s', name, phone);

    utils.sendServiceMessageCallMe(`Клиент ${name} просит перезвонить ему на ${phone}`).then(response => {
        res.status(200).json({
            ok: true,
            message: 'success',
        });
    }).catch(error => {
        res.status(400).json({
            ok: false,
            message: error
        });
    });
});

router.post('/sendCourier', async (req, res) => {

    const data = req.body;

    let alias = '';

    const user = await db.actions.user.getWithPopulate(data.userId);
    if (data.alias) {
        await db.actions.user.updateOne2(data.userId, {
            alias: data.alias,
        });
        alias = data.alias;
    } else {
        alias = user.alias;
    }

    let phone = '';
    if (data.phoneNumber) {
        await db.actions.user.updateOne2(data.userId, {
            phoneNumber: data.phoneNumber,
        });
        phone = data.phoneNumber;
    } else {
        phone = user.phoneNumber;
    }

    let address = '';
    if (data.address) {
        address = data.address;
        await db.actions.userAddress.create({
            user: data.userId,
            address,
        });
    } else {
        const addressObj = await db.actions.userAddress.findById(data.addressId);
        address = addressObj.address;
    }



    const times = [
        '9:00 - 13:00',
        '13:00 - 17:00',
        '17:00 - 21:00',
    ];

    utils.sendServiceMessageCallMe(`Клиент ${alias} с номером телефона ${phone} просит прислать курьера по адресу "${address}". Удобное время для встречи ${times[data.time - 1]}.`).then(response => {
        res.status(200).json({
            ok: true,
            message: 'success',
        });
    }).catch(error => {
        res.status(400).json({
            ok: false,
            message: error
        });
    });
});

module.exports = router;
