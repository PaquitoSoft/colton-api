const { gql } = require("apollo-server");
const log = require('debug')('colton:Types:Paylist');

const getUserPlaylistsActionBuilder = require('../../../application/actions/playlist/get-user-playlists');
const getPlaylistActionBuilder = require('../../../application/actions/playlist/get-playlist');
const getUserFavoritePlaylistBuilder = require('../../../application/actions/playlist/get-user-favorites-playlist');
const toggleUserFavoriteTrackActionBuilder = require('../../../application/actions/playlist/toggle-user-favorite-track');

const {
	repositoriesTypes,
	createMongooseRepository
} = require('../../../adapters/repositories/repositories-factory');

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
	"owner": "xxxx@gmail.com",
	"position": 0,
	"tracks": []
*/
const typeName = 'Playlist';

const typeDefinition = gql`
	type Playlist {
		id: ID!
		creationDate: DateTime!
		name: String!
		tracksCount: Int!
		tracks: [Track]
		position: Int!
	}

	input NewPlaylist {
		name: String!
	}

	input UpdatePlaylist {
		name: String
		position: Int
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
		getPlaylist(playlistId: ID!): Playlist
		getPlaylistsByUser: [Playlist]
		getUserFavoritesPlaylist: Playlist
	}

	extend type Mutation {
		createPlaylist(playlist: NewPlaylist): Playlist
		updatePlaylist(playlist: UpdatePlaylist): Playlist
		removePlaylist(playlistId: ID!): Boolean
		addTrackToPlaylist(track: NewTrack!): Playlist
		removeTrackFromPlaylist(trackId: ID!): Playlist
		toggleUserFavoriteTrack(track: FavoriteTrack!): Playlist
		sharePlaylist(playlistId: ID!, emails: [String]!): Boolean
	}
`;

function createAction(actionBuilder, mongoose) {
	return actionBuilder({
		playlistRepository: createMongooseRepository({
			repositoryType: repositoriesTypes.Playlist,
			mongoose
		})
	});
}

function getPlaylist(root, params, context) {
	log('getPlaylist details...');
	const { user, mongoose } = context;
	const action = createAction(getPlaylistActionBuilder, mongoose);

	return action({
		playlistId: params.playlistId,
		userEmail: user.email
	});
}

function getPlaylistsByUser(root, params, context) {
	log('getPlaylist by user...');
	const { user, mongoose } = context;
	const action = createAction(getUserPlaylistsActionBuilder, mongoose);

	return action({ userEmail: user.email });
}

function getUserFavoritesPlaylist(root, params, context) {
	log('getPlaylist details...');
	const { user, mongoose } = context;
	const action = createAction(getUserFavoritePlaylistBuilder, mongoose);

	return action({ userEmail: user.email });
}

function toggleUserFavoriteTrack(root, params, context) {
	log('toggleUserFavoriteTrack...');
	const { user, mongoose } = context;
	const { track } = params;
	const action = createAction(
		toggleUserFavoriteTrackActionBuilder,
		mongoose
	);

	return action({ userEmail: user.email, track });
}

async function createPlaylist(root, params, context) {}
async function updatePlaylist(root, params, context) {}
async function removePlaylist(root, params, context) {}
async function addTrackToPlaylist(root, params, context) {}
async function removeTrackFromPlaylist(root, params, context) {}
async function sharePlaylist(root, params, context) {}

const resolvers = {
	type: {
		id: root => root._id || root.id
	},
	queries: {
		getPlaylist,
		getPlaylistsByUser,
		getUserFavoritesPlaylist
	},
	mutations: {
		createPlaylist,
		updatePlaylist,
		removePlaylist,
		addTrackToPlaylist,
		removeTrackFromPlaylist,
		toggleUserFavoriteTrack,
		sharePlaylist
	}
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
