const { gql } = require("apollo-server");
const UserModel = require('../data-providers/repository/models/user-model');

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

const typeName = 'User';

const typeDefinition = gql`
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

    extend type Query {
        getUser(userId: ID!): User
        getUserPlaylists(userId: ID!): [${Playlist}]
    }

    extend type Mutation {
        createUser(user: NewUser): User
        updateUser(user: UpdateUser): User
        login(email: String!, password: String!): User
        logout(accessToken: String!): Boolean
    }
`;

async function getUser(root, params, context) {
    console.log('Types::User::getUser# TODO loading user...');
    return {
        id: 'asdjkasdhjk',
        email: 'rollo@tomas.si',
        nickname: 'Rollo Tomassi'
    };
}
async function createUser(root, params, context) {}
async function updateUser(root, params, context) {}
async function login(root, params, context) {
    console.log('Types::User::login# Processing login mutation...');
    const { email, password } = params;

    const user = UserModel.validateCredentials(email, password);

    console.log('UserType::login# user:', user);

    return user;
}
async function logout(root, params, context) {}

const resolvers = {
    type: {
        id: root => root._id || root.id
    },
    queries: {
        getUser
    },
    mutations: {
        createUser,
        updateUser,
        login,
        logout
    }
};

module.exports = {
    typeName,
    typeDefinition,
    resolvers
};
