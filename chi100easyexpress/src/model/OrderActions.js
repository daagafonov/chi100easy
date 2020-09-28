const Order = require('./Order');
const User = require('./User');

const createOrder = function(o) {
    return Order.create(o);
}

const addOrderToUser = function(userId, order) {
    const o = Order.updateOne({
        _id: order._id
    }, {
        $set: {
            user: userId,
        }
    });
    return o;
};

const findByUserId = function(userId) {
    return Order.find({
        user: userId
    });
}

const findBy = function(query) {
    return Order.find(query).populate("user", "-__v");
}

const getOrderWithPopulateUser = function(id) {
    return Order.findById(id).populate("user", "-__v");
};

const getOrderWithPopulateDocument = function(id) {
    return Order.findById(id).populate("document", "-__v").populate('user', '-__v');
};

const findById = function(id) {
    return Order.findById(id);
}

const findAll = function() {
    return Order.find();
}

const findByInternalId = (internalId) => {
    return Order.findOne({
        internalOrderId: internalId
    });
}

const updateOne = function(id, fields) {
    return Order.updateOne({
        _id: id
    }, {
        $set: fields
    });
}

module.exports = {
    create:  createOrder,
    addOrderToUser,
    findById,
    findAll,
    getOrderWithPopulateUser,
    getOrderWithPopulateDocument,
    findByUserId,
    updateOne,
    findBy,
    findByInternalId,
}
