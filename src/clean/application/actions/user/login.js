const createLoginAction = ({ userRepository }) => ({ email, password }) =>
    userRepository.validateCredentials(email, password);

module.exports = createLoginAction;
