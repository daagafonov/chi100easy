const Offer = require('./Offer');

const createOffer = function(o) {
    return Offer.create(o);
}

const findFirstAvailable = () => {

    const now = new Date();

    return Offer.findOne({
        validFrom: { $lt: now },
        validTo: { $gt: now },
        $or: [ { permanent: false }, { permanent: { $exists: false } } ]
    });
};

const findAllAvailable = () => {
    const now = new Date();

    return Offer.find({
        validFrom: { $lt: now },
        validTo: { $gt: now }
    });
}

const updateOne = function(id, fields) {
    fields.updated_dt = new Date();
    return Offer.updateOne({
        _id: id,
    }, {
        $set: fields,
    });
}

const getOfferWithPopulateImage = (id) => {
    return Offer.findById(id).populate("image", "-__v");
};

const findAll = () => {
    return Offer.find();
};

const deleteFn = (id) => {
    return  Offer.findOneAndDelete({
        _id: id,
    });
}

module.exports = {
    create:  createOffer,
    updateOne,
    getOfferWithPopulateImage,
    delete: deleteFn,
    findAll,
    findFirstAvailable,
    findAllAvailable,
}
