function makeError(message) {
    return {
        ok: false,
        message,
    }
}

function resError(res, message) {
    res.status(500).json(makeError(message));
}

function resNotFound(res, message) {
    res.status(404).json(makeError(message));
}

module.exports = {
    makeError,
    resError,
    resNotFound,
}
