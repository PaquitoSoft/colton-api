const { ApolloServer, gql } = require('apollo-server');
const types = require('./types');

const typeDefs = types.getTypesDefinitions();
const resolvers = types.getTypesResolvers();

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        const authToken = req.headers.authorization;

        return {
            user: {}
        };
    } 
});

server.listen()
    .then(({ url }) => {
        console.log(`Server ready at ${url}`);
    })
    .catch(error => {
        console.error('Could not start server:', error);
    });