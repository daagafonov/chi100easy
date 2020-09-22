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

const getOrderWithPopulateItems = function(id) {
    return Order.findById(id).populate("items", "-__v");
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

const save = function() {
    return Order.find();
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
    getOrderWithPopulateItems,
    getOrderWithPopulateDocument,
    findByUserId,
    updateOne,
}
