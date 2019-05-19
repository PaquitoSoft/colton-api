const { AuthenticationError } = require('apollo-server-core');
const jwt = require('jsonwebtoken');
const {
    repositoriesTypes,
    createMongooseRepository
} = require('../../../adapters/repositories/repositories-factory');


// module.exports = (request, context) => {
//     // token = jwt.verify(context.request.get("Authorization"), "secret");
//     const authHeader = request.get('Authentication');

//     console.log('Authentication header:', authHeader);

//     if (!authHeader) {
//         throw new AuthenticationError("Not autheticated");
//     }

// };

const isPublicOperation = (operation, publicOperations) => publicOperations.includes(operation);

module.exports.createAuthMiddleware = ({ publicOpertions = [], signature } = {}) => {
    // eslint-disable-next-line max-params
    return async (resolve, root, args, context, info) => {
        console.log(`APPLYING auth middleware... ${info.fieldName} - isPublicOperation? ${isPublicOperation(info.fieldName, publicOpertions)}`);
        const newContext = { ...context };

        if (!isPublicOperation(info.fieldName, publicOpertions)) {
            let userId;

            try {
                userId = jwt.verify(context.authToken, signature);
            } catch (error) {
                throw new AuthenticationError('Invalid authetication token');
            }

            const UserRepository = createMongooseRepository({
                repositoryType: repositoriesTypes.User,
                mongoose: context.mongoose
            });

            try {
                const user = await UserRepository.getUser(userId);

                if (!user) {
                    throw new AuthenticationError('Received token does not correspond to any existing user');
                }

                newContext.user = user;

            } catch (error) {
                throw new Error('There was a problem looking for a user');
            }
        }

        return resolve(root, args, newContext, info);
    };
};

// module.exports = (resolve, root, args, context, info) => {
//     console.log(`APPLYING auth middleware... ${info.fieldName}`);
//     return resolve(root, args, context, info);
// }


// module.exports = async (resolve, root, args, context, info) => {
//     console.log(`1. logInput root: ${JSON.stringify(root)}`);
//     console.log(`1. logInput args: ${JSON.stringify(args)}`);
//     console.log(`1. logInput info: ${info.fieldName}, ${info.schema}, ${info.operation}`);
//     const result = await resolve(root, args, context, info);
//     console.log(`4. logResult: ${JSON.stringify(result)}`);
//     return result;
// }
