/*
{
    "name": "Tindersticks",
    "owner": "xxxxx@gmail.com",
    "_id": {
        "$oid": "50758147b7bad6b03400605d"
    },
    "tracks": [
        {
            "title": "Tindersticks - Dying Slowly",
            "duration": "274",
            "rating": 9.8471766,
            "externalId": "icC4O5mq_-4",
            "_id": {
                "$oid": "50758147b7bad6b034006065"
            },
            "position": -1
        },
    ],
    "position": 16,
    "creationDate": {
        "$date": "2012-10-10T12:36:13.793Z"
    }
}
*/
function buildPlaylistSchema(MongooseSchema) {
	const playlistSchema = new MongooseSchema({
		// id: ID!
		name: { type: String, required: true },
		owner: { type: String, required: true },
		creationDate: { type: Date, required: true, 'default': Date.now() },
		position: { type: Number, required: true, 'default': -1 },
		playbacks: { type: Number, required: false, 'default': 0 },
		isFavoritesPlaylist: { type: Boolean, required: true, 'default': false },
		tracks: [
			{
				externalId: { type: String, required: true },
				title: { type: String, required: true },
				duration: { type: String, required: true },
				length: { type: Number, required: true, 'default': 0 },
				thumbnailUrl: { type: String, required: false },
				position: { type: Number, required: true, 'default': -1 }
			}
		]
	});

	playlistSchema.virtual('tracksCount').get(function() {
		return this.tracks.length;
	});

	playlistSchema.statics.getUserPlaylists = function getUserPlaylists(userEmail) {
		return this.find({ owner: userEmail, isFavoritesPlaylist: { $ne: true } })
			.sort({ creationDate: -1 })
			.exec();
	};

	playlistSchema.statics.getUserFavoritesPlaylist = function getUserFavoritesPlaylist({
		userEmail,
		populateOnlyTrackIds = false
	}) {
		const query = this.findOne({ owner: userEmail, isFavoritesPlaylist: true });

		if (populateOnlyTrackIds) {
			query.select('tracks.externalId');
		}

		return query.exec();
	};

	playlistSchema.statics.findPlaylistByName = function findPlaylistByName({ playlistName, userEmail }) {
		return this.findOne({ owner: userEmail, name: playlistName }).exec();
	}

	return playlistSchema;
}

module.exports.buildPlaylistSchema = buildPlaylistSchema;
