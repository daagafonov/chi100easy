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

    utils.sendServiceMessageCallMe(`Клиент ${data.name} с номером телефона ${data.phoneNumber} просит прислать курьера по адресу "${address}". Удобное время для встречи ${data.time}.`).then(response => {
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

    // const {name, phone} = req.body;
    //
    // console.log('name=%s, phone=%s', name, phone);
    //
    // utils.sendServiceMessageCallMe(`Клиент ${name} просит перезвонить ему на ${phone}`).then(response => {
    //     res.status(200).json({
    //         ok: true,
    //         message: 'success',
    //     });
    // }).catch(error => {
    //     res.status(400).json({
    //         ok: false,
    //         message: error
    //     });
    // });
});

module.exports = router;
