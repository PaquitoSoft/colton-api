function buildFavoriteTracksSchema(MongooseSchema) {
	const favoriteTracksSchema = new MongooseSchema({
		owner: { type: String, required: true },
		creationDate: { type: Date, required: true, 'default': Date.now() },
		tracks: [
			{
				externalId: { type: String, required: true },
				title: { type: String, required: true },
				duration: { type: String, required: true },
				position: { type: Number, required: true, 'default': -1 },
				creationDate: { type: Date, required: true, 'default': Date.now() }
			}
		]
	});

	favoriteTracksSchema.virtual('tracksCount').get(function() {
		return this.tracks.length;
	});

	favoriteTracksSchema.statics.getUserFavoriteTracks = function getUserFavoriteTracks(
		userEmail,
		populateOnlyIds = false
	) {
		const query = this.findOne({ owner: userEmail });

		if (populateOnlyIds) {
			query.select('tracks.externalId');
		}

		return query.exec();
	};

	return favoriteTracksSchema;
}

module.exports.buildFavoriteTracksSchema = buildFavoriteTracksSchema;
