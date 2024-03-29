const { buildPlaylistSchema } = require('./mongoose-schemas/playlist-schema');

class PlaylistMongooseRepository {
	constructor(mongoose) {
		this.PlaylistModel = mongoose.model('Playlist', buildPlaylistSchema(mongoose.Schema));
	}

	createPlaylist(playlistData) {
		const model = new this.PlaylistModel(playlistData);
		return model.save();
	}

	updatePlaylist(playlistModel) {
		return playlistModel.save();
	}

	removePlaylist(playlistModel) {
		return playlistModel.remove();
	}

	getUserPlaylists(userEmail) {
		return this.PlaylistModel.getUserPlaylists(userEmail);
	}

	getPlaylist(playlistId) {
		return this.PlaylistModel.findById(playlistId);
	}

	getUserFavoritesPlaylist({ userEmail, populateOnlyTrackIds = false }) {
		return this.PlaylistModel.getUserFavoritesPlaylist({ userEmail, populateOnlyTrackIds });
	}

	getUserPlaylistsWithTrack({ trackExternalId, userEmail }) {
		return this.PlaylistModel.getUserPlaylistsWithTrack({ trackExternalId, userEmail });
	}

	findPlaylistByName({ playlistName, userEmail }) {
		return this.PlaylistModel.findPlaylistByName({ playlistName, userEmail });
	}
}

module.exports = PlaylistMongooseRepository;
