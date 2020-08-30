const User = require('./User');

const createUser = function(u) {
    return User.create(u);
}

const getUserWithPopulate = function(userId) {
    return User.findById(userId).populate("orders", "-__v");
};

const findByTelegramUserId = function (externalId) {
    return User.findOne({
        telegramUserId: externalId
    });
}

module.exports = {
    create: createUser,
    getWithPopulate: getUserWithPopulate,
    getByTelegramUserId: findByTelegramUserId,
}
