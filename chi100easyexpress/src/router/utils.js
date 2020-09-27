function makeError(message) {
    return {
        ok: false,
        message,
    }
}

function resStatusError(status, res, message) {
    res.status(status).json(makeError(message));
}

function resError(res, message) {
    resStatusError(500, res, message);
}

function resNotFound(res, message) {
    resStatusError(404, res, message);
}

module.exports = {
    makeError,
    resError,
    resNotFound,
    resStatusError,
}
