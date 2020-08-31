const mongoose = require('mongoose');
const OrderItem = require('./OrderItem');

const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.new,
    },
    comment: {
        type: String,
        required: false
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: OrderItem,
    }]
});

module.exports = mongoose.model('Order', orderSchema);
