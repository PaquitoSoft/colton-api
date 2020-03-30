const { encrypt, encryptPassword } = require('../adapter-helpers');
const { buildUserSchema } = require('./mongoose-schemas/user-schema');

class UserMongooseRepository {
	constructor(mongoose) {
		this.UserModel = mongoose.model('User', buildUserSchema(mongoose.Schema));
	}

	validateCredentials(username, password) {
		return this.UserModel.validateCredentials(username, password);
	}

	isEmailAlreadyInUse(email) {
		return this.UserModel.isEmailAlreadyInUse(email);
	}

	createUser(userData) {
		const salt = encrypt(`${Date.now()}--${userData.password}`);
		const model = new this.UserModel({
			...userData,
			emailB: userData.email.toUpperCase(),
			salt,
			password: encryptPassword(userData.password, salt)
		});

		return model.save();
	}

	updateUser(userModel) {
		return userModel.update();
	}

	getUser(userId) {
		return this.UserModel.findById(userId);
	}

	findByEmail(email) {
		return this.UserModel.findByEmail(email);
	}
}

module.exports = UserMongooseRepository;
