const { buildPlaylistSchema } = require('./mongoose-schemas/playlist-schema');

class PlaylistMongooseRepository {
	constructor(mongoose) {
		this.PlaylistModel = mongoose.model('Playlist', buildPlaylistSchema(mongoose.Schema));
	}

	getUserPlaylists(userEmail) {
		return this.PlaylistModel.getUserPlaylists(userEmail);
	}

	getPlaylist(playlistId) {
		return this.PlaylistModel.findById(playlistId);
	}

}

module.exports = PlaylistMongooseRepository;
