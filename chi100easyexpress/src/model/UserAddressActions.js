const User = require('./User');
const UserAddress = require('./UserAddress');

const createAddress = function(o) {
    return UserAddress.create(o);
}

const addAddressToUser = function(userId, order) {
    const o = UserAddress.updateOne({
        _id: order._id
    }, {
        $set: {
            user: userId,
            updated_dt: new Date(),
        }
    });
    return o;
};

const findByUserId = function(userId) {
    return UserAddress.find({
        user: userId
    });
}

const findBy = function(query) {
    return UserAddress.find(query).populate("user", "-__v");
}

const getAddressWithPopulateUser = function(id) {
    return UserAddress.findById(id).populate("user", "-__v");
};

const findById = function(id) {
    return UserAddress.findById(id);
}

const findAll = function() {
    return UserAddress.find();
}

const updateOne = function(id, fields) {
    fields.updated_dt = new Date();
    return UserAddress.updateOne({
        _id: id,
    }, {
        $set: fields,
    });
}

const deleteFn = (id) => {
    return  UserAddress.findOneAndDelete({
        _id: id,
    });
}

module.exports = {
    create:  createAddress,
    findById,
    findAll,
    getAddressWithPopulateUser,
    addAddressToUser,
    findByUserId,
    updateOne,
    findBy,
    delete: deleteFn,
}
