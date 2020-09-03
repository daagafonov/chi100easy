const mongoose = require('mongoose');
const Order = require('./Order');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
    },
    username: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
        min: 12,
        max: 12,
    },
    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
    telegramUserId: {
        type: String,
        required: true,
        index: true,
        min: 6,
    },
});

module.exports = mongoose.model('User', userSchema);
