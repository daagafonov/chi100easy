function makeError(message) {
    return {
        ok: false,
        message,
    }
}

function resStatusError(status, res, message) {
    return res.status(status).json(makeError(message));
}

function resError(res, message) {
    return resStatusError(500, res, message);
}

function resNotFound(res, message) {
    return resStatusError(404, res, message);
}

module.exports = {
    makeError,
    resError,
    resNotFound,
    resStatusError,
}
