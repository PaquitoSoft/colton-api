const { encryptPassword } = require('../../../utils');

// eslint-disable-next-line max-lines-per-function
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

	// userSchema.pre('save', next => {
	// 	if (this.isNew) {
	// 		// Encrypt password
	// 		this.salt = encrypt(`${(new Date()).getTime()}--${this.password}`);
	// 		this.password = encryptPassword(this.password, this.salt);
	// 	}

	// 	next();
	// });

	userSchema.statics.isEmailAlreadyInUse = async function(email) {
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

	userSchema.statics.findByEmail = function findByEmail(email) {
		return this.findOne({ emailB: email.toUpperCase() });
	};

	return userSchema;
}

module.exports.buildUserSchema = buildUserSchema;
