const jwt = require('jsonwebtoken');
const utils = require('./utils');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return utils.resStatusError(401, res, 'Access Denied');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return utils.resStatusError(403, res, {
                code: 'INVALID_TOKEN',
                description: 'Invalid Token'
            });
        }
        req.user = user;

        console.log(req.user);

        next();
    });
};
