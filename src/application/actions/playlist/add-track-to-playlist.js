const Boom = require('@hapi/boom');

const createAddTrackToPlaylist = ({ playlistRepository }) => async ({ playlistId, newTrack, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (!playlist.isPublic && playlist.owner !== userEmail) {
		throw Boom.unauthorized('This playlist is private');
	}

	if (playlist.tracks.find(track => track.externalId === newTrack.externalId)) {
		throw Boom.preconditionFailed('Song is already in the playlist');
	}

	playlist.tracks.push(newTrack);

	return playlistRepository.updatePlaylist(playlist);
};

module.exports = createAddTrackToPlaylist;
