const Boom = require('@hapi/boom');

const createNewPlaylist = ({ playlistRepository }) => async ({ newPlaylist, userEmail }) => {
	const playlist = await playlistRepository.findPlaylistByName({
		playlistName: newPlaylist.name, userEmail
	});

	if (playlist) {
		throw Boom.preconditionFailed('A playlist with the same name already exists.');
	}

	return playlistRepository.createPlaylist({
		...newPlaylist,
		owner: userEmail
	});
};

module.exports = createNewPlaylist;
