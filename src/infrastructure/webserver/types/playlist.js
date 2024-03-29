const { gql } = require("apollo-server");
const log = require('debug')('colton:Types:Paylist');

const getUserPlaylistsActionBuilder = require('../../../application/actions/playlist/get-user-playlists');
const getPlaylistActionBuilder = require('../../../application/actions/playlist/get-playlist');
const getUserFavoritePlaylistBuilder = require('../../../application/actions/playlist/get-user-favorites-playlist');
const toggleUserFavoriteTrackActionBuilder = require('../../../application/actions/playlist/toggle-user-favorite-track');
const addTrackToPlaylistActionBuilder = require('../../../application/actions/playlist/add-track-to-playlist');
const removeTrackFromPlaylistActionBuilder = require('../../../application/actions/playlist/remove-track-from-playlist');
const createPlaylistActionBuilder = require('../../../application/actions/playlist/create-playlist');
const removePlaylistActionBuilder = require('../../../application/actions/playlist/remove-playlist');
const disableTrackActionBuilder = require('../../../application/actions/playlist/disable-track');

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
		tracks: [NewTrack]
	}

	input UpdatePlaylist {
		name: String
		position: Int
	}

	input FavoriteTrack {
		id: ID
		externalId: String!
		title: String!
		duration: String
		length: Int
		thumbnailUrl: String
		rating: Int
		isFavorite: Boolean
		isDisabled: Boolean
	}

	extend type Query {
		getPlaylist(playlistId: ID!): Playlist
		getPlaylistsByUser: [Playlist]
		getUserFavoritesPlaylist: Playlist
	}

	extend type Mutation {
		createPlaylist(playlist: NewPlaylist): Playlist
		removePlaylist(playlistId: ID!): Boolean
		addTrackToPlaylist(playlistId: ID!, track: NewTrack!): Playlist
		removeTrackFromPlaylist(playlistId: ID!, trackId: ID!): Playlist
		toggleUserFavoriteTrack(track: FavoriteTrack!): Playlist
		notifyDisabledTrack(externalId: String!): Boolean
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

function addTrackToPlaylist(root, params, context) {
	log('addTrackToPlaylist...');
	const { user, mongoose } = context;
	const { playlistId, track } = params;
	const action = createAction(
		addTrackToPlaylistActionBuilder,
		mongoose
	);

	return action({ playlistId, newTrack: track, userEmail: user.email });
}

function removeTrackFromPlaylist(root, params, context) {
	log('removeTrackToPlaylist...');
	const { user, mongoose } = context;
	const { playlistId, trackId } = params;
	const action = createAction(
		removeTrackFromPlaylistActionBuilder,
		mongoose
	);

	return action({ playlistId, trackId, userEmail: user.email });
}

function createPlaylist(root, params, context) {
	log('createPlaylist...');
	const { user, mongoose } = context;
	const { playlist } = params;
	const action = createAction(
		createPlaylistActionBuilder,
		mongoose
	);

	return action({ newPlaylist: playlist, userEmail: user.email });
}

async function removePlaylist(root, params, context) {
	log('removePlaylist...');
	const { user, mongoose } = context;
	const { playlistId } = params;
	const action = createAction(
		removePlaylistActionBuilder,
		mongoose
	);

	await action({ playlistId, userEmail: user.email });
	return true;
}

async function notifyDisabledTrack(root, params, context) {
	log('notifyDisabledTrack...');
	const { user, mongoose } = context;
	const { externalId } = params;
	const action = createAction(disableTrackActionBuilder, mongoose);

	await action({ trackExternalId: externalId, userEmail: user.email });
	return true;
}

function sharePlaylist() {}

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
		removePlaylist,
		addTrackToPlaylist,
		removeTrackFromPlaylist,
		toggleUserFavoriteTrack,
		notifyDisabledTrack,
		sharePlaylist
	}
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
