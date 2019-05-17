const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const mongoose = require('mongoose');
const { createAuthMiddleware } = require('./middlewares/authentication');
const types = require('./types');

const MONGO_URL = process.env.COLTON_MONGODB_URL || 'mongodb://colton2:DStoma23@ds029817.mongolab.com:29817/colton-dev';
const AUTH_SIGNATURE = process.env.COLTON_AUTH_SIGNATURE || 'fjasdfhjdgsfjasdfjgsadfhdvschkjas';

const schema = makeExecutableSchema({ 
    typeDefs: types.getTypesDefinitions(), 
    resolvers: types.getTypesResolvers()
});

const authenticationMiddleware = createAuthMiddleware({
    publicOpertions: ['login', 'createUser'],
    signature: AUTH_SIGNATURE
});

const schemaWithMiddlewares = applyMiddleware(schema, {
    Query: authenticationMiddleware,
    Mutation: authenticationMiddleware
});

const server = new ApolloServer({
    schema: schemaWithMiddlewares,
    debug: true,
    context: ({ req }) => {
        console.log('Building context...');
        const authToken = req.headers.authorization;
        
        return {
            authToken
        };
    },
    formatError: error => {
        console.warn(error);
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

mongoose.connect(MONGO_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
    server.listen()
        .then(({ url }) => {
            console.log(`Server ready at ${url}`);
        })
        .catch(error => {
            console.error('Could not start server:', error);
        });
});