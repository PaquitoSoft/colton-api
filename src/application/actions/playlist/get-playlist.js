const Boom = require('@hapi/boom');

const createGetPlaylist = ({ playlistRepository }) => async ({ playlistId, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (!playlist.isPublic && playlist.owner !== userEmail) {
		throw Boom.unauthorized('This playlist is private');
	}

	const favoritesPlaylist = await playlistRepository.getUserFavoritesPlaylist({
		userEmail,
		populateOnlyTrackIds: true
	});

	if (favoritesPlaylist && favoritesPlaylist.tracks.length > 0) {
		const favoriteTrackExternalIds = favoritesPlaylist.tracks.map(favoriteTrack => favoriteTrack.externalId);
		playlist.tracks.forEach(track => {
			track.isFavorite = favoriteTrackExternalIds.includes(track.externalId);
		});
	}

	return playlist;
};

module.exports = createGetPlaylist;
