const mongoose = require('mongoose');

const Product = require('./dictionary/Product');

function  generateIndex() {
    return 0;
}

const orderItemSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
    },

    count: {
        type: Number,
        required: true,
        default: 1,
    },

    creation_dt: {
        type: Date,
        required: true,
        default: new Date(),
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
        required: true,
    },

});

module.exports = mongoose.model('OrderItem', orderItemSchema);
