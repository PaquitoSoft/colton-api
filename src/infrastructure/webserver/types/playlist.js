const { gql } = require("apollo-server");
const log = require('debug')('colton:Types:Paylist');

const createGetUserPlaylistsAction = require('../../../application/actions/playlist/get-user-playlists');
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
    "owner": "alexsandratm@gmail.com",
    "position": 0,
    "tracks": []
*/
const typeName = 'Playlist';

const typeDefinition = gql`
    type Playlist {
        id: ID!
        creationDate: DateTime!
        name: String!
        owner: User!
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

    extend type Query {
        getPlaylist(playlistId: ID!): Playlist
		getPlaylistsByUser: [Playlist]
    }

    extend type Mutation {
        createPlaylist(playlist: NewPlaylist): Playlist
        updatePlaylist(playlist: UpdatePlaylist): Playlist
        removePlaylist(playlistId: ID!): Boolean
        addTrackToPlaylist(track: NewTrack!): Playlist
        removeTrackFromPlaylist(trackId: ID!): Playlist
        sharePlaylist(playlistId: ID!, emails: [String]!): Boolean
    }
`;

async function getPlaylist(root, params, context) {}
function getPlaylistsByUser(root, params, context) {
	log('getPlaylist by user...');
	const { user, mongoose } = context;
	const getUserPlaylistsAction = createGetUserPlaylistsAction({
		playlistRepository: createMongooseRepository({
			repositoryType: repositoriesTypes.Playlist,
			mongoose
		})
	});

	return getUserPlaylistsAction({ userEmail: user.email });
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
		getPlaylistsByUser
	},
	mutations: {
		createPlaylist,
		updatePlaylist,
		removePlaylist,
		addTrackToPlaylist,
		removeTrackFromPlaylist,
		sharePlaylist
	}
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
