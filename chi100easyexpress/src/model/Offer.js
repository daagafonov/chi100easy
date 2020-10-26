const mongoose = require('mongoose');

function increaseDate() {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now;
}

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
    shortDescription: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: false,
        default: '',
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    validFrom: {
        type: Date,
        required: true,
        default: new Date(),
    },
    validTo: {
        type: Date,
        required: true,
        default: increaseDate(),
    },
});

module.exports = mongoose.model('Offer', schema);
