const express = require('express');
const userRouter = require("./users");
const orderRouter = require("./order");
const offerRouter = require("./offer");
const orderItemsRouter = require("./order-item");
const productsRouter = require("./products");
const paymentsRouter = require('./payments');
const userAddressRouter = require('./userAddress');
const auth = require('./auth');
const serviceRouter = require('./service');

const router = express.Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/offers', offerRouter);
router.use('/orderItems', orderItemsRouter);
router.use('/products', productsRouter);
router.use('/payments', paymentsRouter);
router.use('/auth', auth);
router.use('/service', serviceRouter);
router.use('/addresses', userAddressRouter);

router.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
    });
});

module.exports = router;
