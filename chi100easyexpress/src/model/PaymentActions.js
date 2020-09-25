const Payment = require('./Payment');

const createPayment = function(o) {
    return Payment.create(o);
}

const find = function() {
    return Payment.find({});
}

module.exports = {
    create:  createPayment,
    find,
}
