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

const updateOne = function(spec) {
    return Product.updateOne(spec);
}

const updateOne2 = function(id, fields) {
    return Product.updateOne({
        _id: id
    }, {
        $set: fields
    });
}

const deleteFn = (id) => {
    return  Product.findOneAndDelete({
        _id: id,
    });
}

module.exports = {
    create:  createOrder,
    findById,
    findAll,
    getOrderWithPopulate,
    updateOne2,
    delete: deleteFn,
}
