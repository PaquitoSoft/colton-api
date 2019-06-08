const { AuthenticationError } = require('apollo-server-core');
const jwt = require('jsonwebtoken');
const log = require('debug')('colton:AuthenticationMiddleware');
const {
	repositoriesTypes,
	createMongooseRepository
} = require('../../../adapters/repositories/repositories-factory');

const isPublicOperation = (operation, publicOperations) => publicOperations.includes(operation);

module.exports.createAuthMiddleware = ({ publicOpertions = [], signature } = {}) =>
	// eslint-disable-next-line max-params
	async (resolve, root, args, context, info) => {
		log(`APPLYING auth middleware... ${info.fieldName} - isPublicOperation? ${isPublicOperation(info.fieldName, publicOpertions)}`);
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
				// TODO: Throw meaningful errors
				throw new Error('There was a problem looking for a user');
			}
		}

		return resolve(root, args, newContext, info);
	};
