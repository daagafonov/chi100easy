const express = require("express");
const router = express.Router();
const utils = require('./telegramUtils');

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

module.exports = router;
