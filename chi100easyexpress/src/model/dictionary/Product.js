const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    productIdentifier: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    currency: {
        type: String,
        enum: ['UAH', 'USD', 'EUR'],
        default: 'UAH',
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);
