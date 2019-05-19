const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
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
            console.log('Building context...');
            const authToken = req.headers.authorization;
    
            return {
                authSignature,
                mongoose,
                authToken
            };
        },
        formatError: error => {
            console.warn(error);
            // console.warn(Object.keys(error.extensions.exception));
            // console.warn(error.extensions.exception.name);
            // console.warn(error.extensions.exception.message);
            console.warn(error.extensions.exception.stacktrace);
            return error;
        },
        formatResponse: (response, query) => {
            console.info('formatResponse::GraphQL query and variables', {
                query: query.queryString,
                vars: query.variables
            });
            console.log('formatResponse::Query keys:', Object.keys(query));
            return response;
        }
    });
};
