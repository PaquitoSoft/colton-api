const { gql } = require("apollo-server");
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const createLoginAction = require('../../../application/actions/user/login');
const createGetUserPlaylistsAction = require('../../../application/actions/playlist/get-user-playlists');
const {
	repositoriesTypes,
	createMongooseRepository
} = require('../../../adapters/repositories/repositories-factory');

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

    type LoginResponse {
        user: User!,
        authToken: String!
    }

    extend type Query {
        getUser(userId: ID!): User
    }

    extend type Mutation {
        createUser(user: NewUser): User
        updateUser(user: UpdateUser): User
        login(email: String!, password: String!): LoginResponse
        logout(accessToken: String!): Boolean
    }
`;

async function getUser(root, params, context) {}
async function createUser(root, params, context) {}
async function updateUser(root, params, context) {}

async function login(root, params, { mongoose, authSignature }) {
	console.log('Types::User::login# Processing login mutation...');
	const { email, password } = params;
	const loginAction = createLoginAction({
		userRepository: createMongooseRepository({
			repositoryType: repositoriesTypes.User,
			mongoose
		})
	});

	try {
		const user = await loginAction({ email, password });

		if (!user) {
			throw Boom.notFound(`User ${email} not found`);
		}

		return {
			user,
			authToken: jwt.sign(user.id, authSignature)
		};
	} catch (error) {
		throw Boom.unauthorized('Invalid credentials');
	}
}

async function logout(root, params, context) {}

const resolvers = {
	type: {
		id: root => root._id || root.id,
		playlists: (root, args, { mongoose }) => {
			const getUserPlaylistsAction = createGetUserPlaylistsAction({
				playlistRepository: createMongooseRepository({
					repositoryType: repositoriesTypes.Playlist,
					mongoose
				})
			});

			return getUserPlaylistsAction({
				userEmail: root.email
			});
		}
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
