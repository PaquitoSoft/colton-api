const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const log = require('debug')('colton:GraphQLServer');

const { createAuthMiddleware } = require('./middlewares/authentication');
const types = require('./types');

module.exports.createServer = function createServer({ mongoose, authSignature }) {
	const schema = makeExecutableSchema({
		typeDefs: types.getTypesDefinitions(),
		resolvers: types.getTypesResolvers()
	});

	const authenticationMiddleware = createAuthMiddleware({
		publicOpertions: ['login', 'createUser'],
		signature: authSignature
	});

	const schemaWithMiddlewares = applyMiddleware(schema, {
		Query: authenticationMiddleware,
		Mutation: authenticationMiddleware
	});

	return new ApolloServer({
		schema: schemaWithMiddlewares,
		debug: true,
		context: ({ req }) => {
			log('Building context...');
			const authToken = req.headers.authorization;

			return {
				authSignature,
				mongoose,
				authToken
			};
		},
		formatError: error => {
			log(error);
			// console.warn(Object.keys(error.extensions.exception));
			// console.warn(error.extensions.exception.name);
			// console.warn(error.extensions.exception.message);
			log(error.extensions.exception.stacktrace);
			return error;
		},
		formatResponse: (response, query) => {
			log('formatResponse::GraphQL query and variables', {
				query: query.queryString,
				vars: query.variables
			});
			log('formatResponse::Query keys:', Object.keys(query));
			return response;
		}
	});
};
