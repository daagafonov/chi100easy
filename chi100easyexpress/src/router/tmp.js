const Crypto = require('crypto');
const { tmpdir } = require('os');
const Path = require('path');

function tmpFile(prefix, suffix) {
    return Path.join(tmpdir(),`${prefix}.${Crypto.randomBytes(6).readUIntLE(0,6).toString(36)}.${suffix}`);
}

module.exports = {
    tmpFile,
}
