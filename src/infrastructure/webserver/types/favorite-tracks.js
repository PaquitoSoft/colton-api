const { gql } = require("apollo-server");
const log = require('debug')('colton:Types:FavoriteTracks');

const getUserFavoriteTracksActionBuilder =
	require('../../../application/actions/favorite-track/get-user-favorite-tracks');
const toogleFavoriteTrackActionBuilder =
	require('../../../application/actions/favorite-track/toggle-favorite-track');

const {
	repositoriesTypes,
	createMongooseRepository
} = require('../../../adapters/repositories/repositories-factory');


const typeName = 'FavoriteTracks';

const typeDefinition = gql`
	type FavoriteTracks {
		id: ID!
		creationDate: DateTime!
		tracksCount: Int!
		tracks: [Track]
	}

	input FavoriteTrack {
		id: ID
		externalId: String!
		title: String!
		duration: String!
		rating: Int
		isFavorite: Boolean
	}

	extend type Query {
		getUserFavoriteTracks: FavoriteTracks
	}

	extend type Mutation {
		toggleFavoriteTrack(track: FavoriteTrack!): FavoriteTracks
	}
`;

function createAction(actionBuilder, mongoose) {
	return actionBuilder({
		favoriteTracksRepository: createMongooseRepository({
			repositoryType: repositoriesTypes.FavoriteTracks,
			mongoose
		})
	});
}

function getUserFavoriteTracks(root, params, context) {
	log('getUserFavoriteTracks...');
	const { user, mongoose } = context;
	const getUserFavoriteTracksAction = createAction(
		getUserFavoriteTracksActionBuilder,
		mongoose
	);

	return getUserFavoriteTracksAction({ userEmail: user.email });
}

function toggleFavoriteTrack(root, params, context) {
	log('toggleFavoriteTrack...');
	const { user, mongoose } = context;
	const { track } = params;
	const toggleFavoriteTrackAction = createAction(
		toogleFavoriteTrackActionBuilder,
		mongoose
	);

	return toggleFavoriteTrackAction({ userEmail: user.email, track });
}

const resolvers = {
	type: {
		id: root => root._id || root.id
	},
	queries: {
		getUserFavoriteTracks
	},
	mutations: {
		toggleFavoriteTrack
	}
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};

