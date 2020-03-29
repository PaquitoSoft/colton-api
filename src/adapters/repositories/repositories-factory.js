const repositoriesTypes = {
	'User': Symbol('User'),
	'Playlist': Symbol('Playlist'),
	'FavoriteTracks': Symbol('FavoriteTracks')
};

const mongooseRepositoriesMap = {
	[repositoriesTypes.User]: require('./user-mongoose-repository'),
	[repositoriesTypes.Playlist]: require('./playlist-mongoose-repository'),
	[repositoriesTypes.FavoriteTracks]: require('./favorite-tracks-repository')
};

const repositoriesMap = {};

const createMongooseRepository = ({ repositoryType, mongoose }) => {
	if (!repositoriesMap[repositoryType]) {
		const Repository = mongooseRepositoriesMap[repositoryType];

		if (!Repository) {
			throw new Error(`No repository exists for code '${repositoryType}'`);
		}

		repositoriesMap[repositoryType] = new Repository(mongoose);
	}

	return repositoriesMap[repositoryType];
};

module.exports = {
	repositoriesTypes,
	createMongooseRepository
};
