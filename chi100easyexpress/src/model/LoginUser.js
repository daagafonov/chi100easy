const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
    },
    email: {
        type: String,
        required: true,
        max: 256,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoginRole'
    }]
});

module.exports = mongoose.model('LoginUser', schema);

