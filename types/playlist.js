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
export const typeName = 'Playlist';

export const typeDefinition = gql`
    type Track {
        id: ID!
        creationDate: DateTime!
        name: String!
        owner: User!
        tracks: [Track]
        position: Int!
    }

    input NewPlaylist {
        name: String!
        tracks: [Track]
    }

    input UpdatePlaylist {
        name: String
        position: Int
    }

    type Query {
        getPlaylist(playlistId: ID!): Playlist
    }

    type Mutation {
        createPlaylist(playlist: NewPlaylist): Playlist
        updatePlaylist(playlist: UpdatePlaylist): Playlist
        removePlaylist(playlistId: ID!): Boolean
        addTrackToPlaylist(track: NewTrack!): Playlist
        removeTrackFromPlaylist(trackId: ID!): Playlist
        sharePlaylist(playlistId: ID!, emails: [String]!): Boolean
    }
`;

async function getPlaylist(root, params, context) {}

async function createPlaylist(root, params, context) {}
async function updatePlaylist(root, params, context) {}
async function removePlaylist(root, params, context) {}
async function addTrackToPlaylist(root, params, context) {}
async function removeTrackFromPlaylist(root, params, context) {}
async function sharePlaylist(root, params, context) {}

export const resolvers = {
    type: {
        id: root => root._id || root.id
    },
    queries: {
        getPlaylist
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
