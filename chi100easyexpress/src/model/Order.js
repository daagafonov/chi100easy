const mongoose = require('mongoose');
// const OrderItem = require('./OrderItem');
// const User = require('./User');

const orderSchema = new mongoose.Schema({
    created_dt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    updated_dt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    orderId: {
        type: String,
        required: false,
    },
    comment: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['CREATED', 'PAID', 'IN_PROGRESS', 'FINISHED'],
        required: true,
        default: 'CREATED',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    },
    finalCost: {
        type: Number,
        required: true,
        default: 0.0,
    },
    documentType: String,
    documentData: Buffer,
});

module.exports = mongoose.model('Order', orderSchema);
