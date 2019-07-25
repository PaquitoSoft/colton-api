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

	userSchema.pre('save', next => {
		if (this.isNew) {
			// Encrypt password
			this.salt = encrypt(`${(new Date()).getTime()}--${this.password}`);
			this.password = encryptPassword(this.password, this.salt);
		}

		next();
	});

	userSchema.statics.isMailAlreadyInUse = async email => {
		const existingUser = await this.findOne({ email: new RegExp(email, 'iu') }).exec();

		return Boolean(existingUser);
	};

	userSchema.statics.validateCredentials = async function validateCredentials(email, password) {
		const user = await this.findOne({ email: new RegExp(email, 'iu') }).exec();

		if (user.password !== encryptPassword(password, user.salt)) {
			throw new Error('Invalid credentials');
		}

		return user;
	};

	return userSchema;
}

module.exports.buildUserSchema = buildUserSchema;
