const express = require('express');
const userRouter = require("./users");
const orderRouter = require("./order");
const orderItemsRouter = require("./order-item");
const productsRouter = require("./products");

const router = express.Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/orderItems', orderItemsRouter);
router.use('/products', productsRouter);

module.exports = router;
