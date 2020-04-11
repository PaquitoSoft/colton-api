const { gql } = require("apollo-server");
/*
{
	"_id": {
		"$oid": "4f4e4054fb83390100000024"
	},
	"creationDate": {
		"$date": "2012-02-29T15:12:20.000Z"
	},
	"name": "la musicalite",
	"order": null,
	"owner": "alexsandratm@gmail.com",
	"position": 0,
	"tracks": [
		{
			"externalId": "gRpO0tASvWg",
			"title": "La Musicalité - Adiós",
			"duration": " (04:52)",
			"rating": "5",
			"_id": {
				"$oid": "4f577b9d148fda0100000010"
			}
		},
*/

const typeName = 'Track';

const typeDefinition = gql`
	type Track {
		id: ID!
		externalId: String!
		title: String!
		duration: String
		length: Int
		isFavorite: Boolean
		isDisabled: Boolean
		thumbnailUrl: String
		rating: Int
	}

	input NewTrack {
		externalId: String!
		title: String!
		duration: String
		length: Int!
		thumbnailUrl: String
		rating: Int
	}
`;

const resolvers = {
	type: {
		id: root => root._id || root.id
	}
};


module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
