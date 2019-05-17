const mongoose = require('mongoose');
const Hashes = require('jshashes');
const Boom = require('@hapi/boom');

function encrypt(text) {
    const sha1Hash = new Hashes.SHA1();

    return sha1Hash.b64(text);
}

function encryptPassword(password, salt) {
    return encrypt(`${password}--${salt}`);
}

const userSchema = new mongoose.Schema({
    // id: ID!
    creationDate: {
        type: Date,
        default: Date.now
    },
    password: String,
    salt: String,
    email: String,
    nickname: String,
    role: String,
    preferredAudioQuality: String
});

userSchema.statics.findByMail = email => this.findOne({ email: new RegExp(email, 'iu') }).exec();

userSchema.statics.validateCredentials = async function validateCredentials(email, password) {
    const user = await this.findOne({ email: new RegExp(email, 'iu') }).exec();

    if (!user) {
        throw Boom.notFound(`User ${email} not found`);
    }

    if (user.password !== encryptPassword(password, user.salt)) {
        throw Boom.unauthorized('Invalid credentials');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);