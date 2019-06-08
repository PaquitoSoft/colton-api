const { encrypt, encryptPassword } = require('../adapter-helpers');
const { buildUserSchema } = require('./mongoose-schemas/user-schema');

class UserMongooseRepository {
	constructor(mongoose) {
		this.UserModel = mongoose.model('User', buildUserSchema(mongoose.Schema));
	}

	validateCredentials(username, password) {
		return this.UserModel.validateCredentials(username, password);
	}

	isMailAlreadyInUse(email) {
		return this.UserModel.isMailAlreadyInUse(email);
	}

	createUser(user) {
		user.salt = encrypt(`${Date.now()}--${user.password}`);
		user.password = encryptPassword(user.password, user.salt);

		const model = new this.UserModel(user);

		return model.save();
	}

	updateUser(user) {
		const model = new this.UserModel(user);

		return model.update();
	}

	getUser(userId) {
		return this.UserModel.findById(userId);
	}
}

module.exports = UserMongooseRepository;
