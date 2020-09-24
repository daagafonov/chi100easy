const Payment = require('./Payment');

const createPayment = function(o) {
    return Payment.create(o);
}

module.exports = {
    create:  createPayment,
}
