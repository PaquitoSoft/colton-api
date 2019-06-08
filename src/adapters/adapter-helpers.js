const Hashes = require('jshashes');

function encrypt(text) {
    const sha1Hash = new Hashes.SHA1();

    return sha1Hash.b64(text);
}

function encryptPassword(password, salt) {
    return encrypt(`${password}--${salt}`);
}

module.exports.encrypt = encrypt;
module.exports.encryptPassword = encryptPassword;
