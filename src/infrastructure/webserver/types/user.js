const { gql } = require("apollo-server");
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const log = require('debug')('colton:Types:User');

const createUserActionBuilder = require('../../../application/actions/user/create-user');
const loginActionBuilder = require('../../../application/actions/user/login');
const resetPasswordActionBuilder = require('../../../application/actions/user/reset-password');
const getUserPlaylistsActionBuilder = require('../../../application/actions/playlist/get-user-playlists');
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

    type LoggedUserResponse {
        user: User!,
        authToken: String!
    }

    extend type Query {
        getUser(userId: ID!): User
    }

    extend type Mutation {
        createUser(user: NewUser): LoggedUserResponse
        updateUser(user: UpdateUser): User
        login(email: String!, password: String!): LoggedUserResponse
        logout(accessToken: String!): Boolean
		resetPassword(email: String!): Boolean
    }
`;

async function getUser(root, params, context) {}
async function logout(root, params, context) {}
async function updateUser(root, params, context) {}

function createAction(actionBuilder, mongoose, context = {}) {
	return actionBuilder({
		...context,
		userRepository: createMongooseRepository({
			repositoryType: repositoriesTypes.User,
			mongoose
		})
	});
}

async function createUser(root, params, { mongoose, authSignature }) {
	const { user: userData } = params;
	const action = createAction(createUserActionBuilder, mongoose);

	const newUser = await action(userData);

	return {
		user: newUser,
		authToken: jwt.sign(newUser.id, authSignature)
	};
}

async function login(root, params, { mongoose, authSignature }) {
	log('login# Processing login mutation...');
	const { email, password } = params;
	const loginAction = createAction(loginActionBuilder, mongoose);

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

async function resetPassword(root, params, { mongoose, mailProvider }) {
	const { email } = params;
	const action = createAction(resetPasswordActionBuilder, mongoose, { mailProvider });

	await action({ email });

	return true;
}


const resolvers = {
	type: {
		id: root => root._id || root.id,
		playlists: (root, args, { mongoose }) => {
			const getUserPlaylistsAction = createAction(getUserPlaylistsActionBuilder, mongoose);

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
		resetPassword,
		login,
		logout
	}
};

module.exports = {
	typeName,
	typeDefinition,
	resolvers
};
