const Order = require('./Order');
const OrderItem = require('./OrderItem');

const createOrder = function(o) {
    return OrderItem.create(o);
}

const addItemToOrder = function(orderId, item) {
    return Order.findByIdAndUpdate(
        orderId, { $push: { items: item._id } }, { new: true, useFindAndModify: false }
    );
};

const findById = function(id) {
    return OrderItem.findById(id);
}

module.exports = {
    create:  createOrder,
    findById,
    addItemToOrder
}
