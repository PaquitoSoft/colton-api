const Boom = require('@hapi/boom');

const createRemovePlaylist = ({ playlistRepository }) => async ({ playlistId, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (playlist.owner !== userEmail) {
		throw Boom.unauthorized('Only the owner of the playlist can delete it');
	}

	return playlistRepository.removePlaylist(playlist);
};

module.exports = createRemovePlaylist;
