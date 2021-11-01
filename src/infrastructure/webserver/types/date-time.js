const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { gql } = require("apollo-server");

const typeName = 'DateTime';

const typeDefinition = gql`
scalar ${typeName}
`;

const resolvers = {
	type: new GraphQLScalarType({
		name: typeName,
		description: 'Date and time precision scalar type',
		parseValue(value) {
			return new Date(value); // value from the client
		},
		serialize(value) {
			// return value.getTime(); // value sent to the client
			return new Date(value);
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10); // ast value is always in string format
			}
			return null;
		}
	})
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
