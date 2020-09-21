const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    type: String,
    data: Buffer,
});

module.exports = mongoose.model('Document', documentSchema);