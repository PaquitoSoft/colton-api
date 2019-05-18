const Hashes = require('jshashes');

// TODO: This is a global helper (move to another directory)
function encrypt(text) {
    const sha1Hash = new Hashes.SHA1();

    return sha1Hash.b64(text);
}

function encryptPassword(password, salt) {
    return encrypt(`${password}--${salt}`);
}

function buildUserSchema(MongooseSchema) {
    const userSchema = new MongooseSchema({
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

    userSchema.statics.isMailAlreadyInUse = async email => {
        const existingUser = await this.findOne({ email: new RegExp(email, 'iu') }).exec();

        return Boolean(existingUser);
    };

    userSchema.statics.validateCredentials = async function validateCredentials(email, password) {
        const user = await this.findOne({ email: new RegExp(email, 'iu') }).exec();

        if (!user) {
            throw new Error(`User ${email} not found`);
        }

        if (user.password !== encryptPassword(password, user.salt)) {
            throw new Error('Invalid credentials');
        }

        return user;
    };
}

module.exports.buildUserSchema = buildUserSchema;
