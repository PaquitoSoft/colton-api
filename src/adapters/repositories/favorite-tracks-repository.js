const { buildFavoriteTracksSchema } = require('./mongoose-schemas/favorite-tracks-schema');

class FavoriteTracksMongooseRepository {
	constructor(mongoose) {
		this.FavoriteTracksModel = mongoose.model('FavoriteTrack', buildFavoriteTracksSchema(mongoose.Schema));
	}

	getUserFavoriteTracks({ userEmail, populateOnlyIds = false }) {
		return this.FavoriteTracksModel.getUserFavoriteTracks(userEmail, populateOnlyIds);
	}

	createUserFavoriteTracks(favoriteTracksData) {
		const model = new this.FavoriteTracksModel(favoriteTracksData);

		return model.save();
	}

	updateUserFavoriteTracks(favoriteTracksModel) {
		return favoriteTracksModel.save();
	}

}

module.exports = FavoriteTracksMongooseRepository;
