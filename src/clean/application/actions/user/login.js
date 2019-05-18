const actionBuilder = ({ userRepository }) => ({ email, password }) =>
    userRepository.validateCredentials(email, password);

module.exports.actionBuilder = actionBuilder;
