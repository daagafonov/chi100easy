const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    type: String,
    data: Buffer,
    size: Number,
    md5: String,
});

module.exports = mongoose.model('Document', documentSchema);