const Boom = require('@hapi/boom');
const { encryptPassword } = require('../../../utils');

const createResetPasswordAction = ({ userRepository }) => async ({ userId, newPassword }) => {

	if (!userId || !newPassword) {
		throw Boom.badRequest('Invalid params received');
	}

	const user = await userRepository.getUser(userId);

	if (!user) {
		throw Boom.notFound('User not found');
	}

	// Update user
	user.password = encryptPassword(newPassword, user.salt);

	return userRepository.updateUser(user);
};

module.exports = createResetPasswordAction;
