const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    externalIdentifier: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['CLOSE&CLEAN', 'HOME&TEXTILE', 'LEATHER&FUR', 'REPAIR'],
        default: 'CLOSE&CLEAN',
        required: true,
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
