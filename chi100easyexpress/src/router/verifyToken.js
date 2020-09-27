const jwt = require('jsonwebtoken');
const utils = require('./utils');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return utils.resStatusError(401, res, 'Access Denied');
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(error) {
        return utils.resStatusError(400, res, 'Invalid Token');
    }
};
