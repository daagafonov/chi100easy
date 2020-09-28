const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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

    merchantAccount: String,
    orderReference: String,
    merchantSignature: String,
    amount: Number,
    currency: {
        type: String,
        enum: ['UAH', 'USD', 'EUR'],
        default: 'UAH',
        required: true,
    },
    authCode: String,
    email: String,
    phone: String,
    createdDate: Date,
    processingDate: Date,
    cardPan: String,
    cardType: String,
    issuerBankCountry: String,
    issuerBankName: String,
    recToken: String,
    transactionStatus: {
        type: String,
        enum: ['Refunded', 'Approved', 'Pending'],
    },
    reason: String,
    reasonCode: Number,
    fee: Number,
    paymentSystem: String,
    acquirerBankName: String,
    cardProduct: String,
    clientName: String,
});

module.exports = mongoose.model('Payment', paymentSchema);

