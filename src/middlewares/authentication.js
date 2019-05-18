// const { AuthenticationError } = require('apollo-server-core');

const isPublicOperation = (operation, publicOperations) => publicOperations.includes(operation);

module.exports.createAuthMiddleware = ({ publicOpertions = [], signature } = {}) => {
    // eslint-disable-next-line max-params
    return (resolve, root, args, context, info) => {
        console.log(`APPLYING auth middleware... ${info.fieldName} - isPublicOperation? ${isPublicOperation(info.fieldName, publicOpertions)}`);

        return resolve(root, args, context, info);
    };
};
