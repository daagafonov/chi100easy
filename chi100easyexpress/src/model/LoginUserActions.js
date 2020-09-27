const LoginUser = require('./LoginUser');

function createLoginUser(obj) {
    return LoginUser.create(obj);
}

module.exports = {
    create:  createLoginUser,
}
