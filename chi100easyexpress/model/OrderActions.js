const Order = require('./Order');
const User = require('./User');

const createOrder = function(o) {
    return Order.create(o);
}

const addOrderToUser = function(userId, order) {
    return User.findByIdAndUpdate(
        userId, { $push: { orders: order._id } }, { new: true, useFindAndModify: false }
    );
};

const getOrderWithPopulate = function(id) {
    return Order.findById(id).populate("items", "-__v");
};

const findById = function(id) {
    return Order.findById(id);
}

const findAll = function() {
    return Order.find();
}

module.exports = {
    create:  createOrder,
    addOrderToUser,
    findById,
    findAll,
    getOrderWithPopulate,
}
