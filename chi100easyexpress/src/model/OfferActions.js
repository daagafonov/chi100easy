const Offer = require('./Offer');

const createOffer = function(o) {
    return Offer.create(o);
}

module.exports = {
    create:  createOffer,
}
