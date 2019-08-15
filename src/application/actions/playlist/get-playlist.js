const Boom = require('@hapi/boom');

const createGetPlaylist = ({ playlistRepository }) => async ({ playlistId, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (!playlist.isPublic && playlist.owner !== userEmail) {
		throw Boom.unauthorized('This playlist is private');
	}

	return playlist;
};

module.exports = createGetPlaylist;
