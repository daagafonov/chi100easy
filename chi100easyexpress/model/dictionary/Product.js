const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    productIdentifier: {
        type: String,
        index: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
    }
});

module.exports = mongoose.model('Product', productSchema);
