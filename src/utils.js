const Hashes = require('jshashes');

function encrypt(text) {
	const sha1Hash = new Hashes.SHA1();

	return sha1Hash.b64(text);
}

function encryptPassword(password, salt) {
	return encrypt(`${password}--${salt}`);
}

function randomString(len) {
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	let result = '';

	for (let index = 0; index < len; index++) {
		const rnum = Math.floor(Math.random() * chars.length);
		result += chars[rnum];
	}

	return result;
}

module.exports.encrypt = encrypt;
module.exports.encryptPassword = encryptPassword;
module.exports.randomString = randomString;
