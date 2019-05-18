const { gql } = require("apollo-server");

const types = [
    require('./date-time'),
    require('./user'),
    require('./track'),
    require('./playlist')
];

module.exports.getTypesDefinitions = () => [
    gql`
        type Query {
            _empty: String
        }
        type Mutation {
            _empty: String
        }
    `,
    ...types.map(type => type.typeDefinition)
];

module.exports.getTypesResolvers = () => {
    return types.reduce((finalResolvers, type) => {
        if (type.resolvers) {
            const { type: _type, queries, mutations } = type.resolvers;

            _type && (finalResolvers[type.typeName] = _type);
            queries && (finalResolvers.Query = { ...finalResolvers.Query, ...queries });
            mutations && (finalResolvers.Mutation = { ...finalResolvers.Mutation, ...mutations });
        }
        return finalResolvers;
    }, {
        Query: {},
        Mutation: {}
    });
};