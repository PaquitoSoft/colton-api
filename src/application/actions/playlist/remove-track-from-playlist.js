const Boom = require('@hapi/boom');

const createRemoveTrackToPlaylist = ({ playlistRepository }) => async ({ playlistId, trackId, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (!playlist.isPublic && playlist.owner !== userEmail) {
		throw Boom.unauthorized('This playlist is private');
	}

	if (!playlist.tracks.some(track => track.id === trackId)) {
		throw Boom.preconditionFailed('Song is not already in the playlist');
	}

	playlist.tracks = playlist.tracks.filter(track => track.id !== trackId);

	return playlistRepository.updatePlaylist(playlist);
};

module.exports = createRemoveTrackToPlaylist;
