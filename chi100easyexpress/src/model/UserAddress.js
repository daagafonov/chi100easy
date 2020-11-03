const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    },
    address: {
        type: String,
    }
});

module.exports = mongoose.model('UserAddress', schema);
