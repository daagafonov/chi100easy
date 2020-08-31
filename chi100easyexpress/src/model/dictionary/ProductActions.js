const Product = require('./Product');

const createOrder = function(o) {
    return Product.create(o);
}

const getOrderWithPopulate = function(id) {
    return Product.findById(id).populate("items", "-__v");
};

const findById = function(id) {
    return Product.findById(id);
}

const findAll = function() {
    return Product.find();
}

module.exports = {
    create:  createOrder,
    findById,
    findAll,
    getOrderWithPopulate,
}
