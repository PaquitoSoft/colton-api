const Boom = require('@hapi/boom');
const { randomString, encryptPassword } = require('../../../utils');

const NEW_PASSWORD_LENGTH = 14;

const createResetPasswordAction = ({ userRepository, mailProvider }) => async ({ email }) => {

	if (!email) {
		throw Boom.badRequest('No email received to reset user password');
	}

	let user = await userRepository.findByEmail(email);

	if (!user) {
		throw Boom.notFound('User not found');
	}

	// Generate new password
	const newPassword = randomString(NEW_PASSWORD_LENGTH);

	// Update user
	user.password = encryptPassword(newPassword, user.salt);
	user = await userRepository.updateUser(user);

	// Send an email to the user
	mailProvider.sendResetPasswordEmail({
		userEmail: email,
		newPassword
	});

	return user;
};

module.exports = createResetPasswordAction;
