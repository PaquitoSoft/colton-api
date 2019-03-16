import { gql } from "apollo-server";

/*
{
    "salt": "cdi56m7lolHMQuyfmPDGbXFs7Ao=",
    "emailB": "ANASANDE@GMAIL.COM",
    "email": "anasande@gmail.com",
    "password": "iTHUNTpTwkydUc/Y2Et7JJNezSo=",
    "nickname": "anasande",
    "_id": {
        "$oid": "4f6366eaa1d89f010000005e"
    },
    "role": "user",
    "registeredAt": {
        "$date": "2012-03-16T16:08:42.617Z"
    }
}
*/
const { typeName: Playlist } = require('./playlist');

export const typeName = 'User';

export const typeDefinition = gql`
    type User {
        id: ID!
        creationDate: DateTime!
        email: String!
        nickname: String!
        role: String!
        preferredAudioQuality: AudioQuality!
        playlists: [${Playlist}]
    }

    enum AudioQuality {
        LOW
        MIDDLE
        HIGH
    }

    input NewUser {
        email: String!
        nickname: String!
        password: String!
    }

    input UpdateUser {
        email: String!
        nickname: String!
        preferredAudioQuality: AudioQuality!        
    }

    type Query {
        getUser(userId: ID!): User
        getUserPlaylists(userId: ID!): [${Playlist}]
    }

    type Mutation {
        createUser(user: NewUser): User
        updateUser(user: UpdateUser): User
    }
`;

async function getUser(root, params, context) {}
async function createUser(root, params, context) {}
async function updateUser(root, params, context) {}

export const resolvers = {
    queries: {
        getUser
    },
    mutations: {
        createUser,
        updateUser
    }
};

