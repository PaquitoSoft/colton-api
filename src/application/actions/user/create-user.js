const createLoginAction = ({ userRepository }) => async ({ email, password, nickname }) => {

	// Validate that don't have a user with the same email as it must be unique
	const isEmailAlreadyInUse = await userRepository.isEmailAlreadyInUse(email);

	if (isEmailAlreadyInUse) {
		throw new Error('Email already in use');
	}

	// Create User
	return userRepository.createUser({ email, password, nickname });
};

module.exports = createLoginAction;
