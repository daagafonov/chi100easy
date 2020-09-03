const User = require('./User');

const createUser = function(u) {
    return User.create(u);
}

const getUserWithPopulate = function(userId) {
    return User.findById(userId);
};

const findByTelegramUserId = function (externalId) {
    return User.findOne({
        telegramUserId: externalId
    });
}

const find = function() {
    return User.find({});
}

const updateOne = function(spec) {
    return User.updateOne(spec);
}

const updateOne2 = function(id, fields) {
    return User.updateOne({
        _id: id
    }, {
        $set: fields
    });
}

module.exports = {
    create: createUser,
    getWithPopulate: getUserWithPopulate,
    getByTelegramUserId: findByTelegramUserId,
    find,
    updateOne,
    updateOne2,

}
