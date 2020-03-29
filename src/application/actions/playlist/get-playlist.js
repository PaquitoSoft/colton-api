const Boom = require('@hapi/boom');

const createGetPlaylist = ({ playlistRepository, favoriteTracksRepository }) => async ({ playlistId, userEmail }) => {
	const playlist = await playlistRepository.getPlaylist(playlistId);

	if (!playlist) {
		throw Boom.notFound('Playlist not found');
	}

	if (!playlist.isPublic && playlist.owner !== userEmail) {
		throw Boom.unauthorized('This playlist is private');
	}

	const favoriteTracks = await favoriteTracksRepository.getUserFavoriteTracks({ userEmail, populateOnlyIds: true });

	if (favoriteTracks && favoriteTracks.tracks.length > 0) {
		const favoriteTrackExternalIds = favoriteTracks.tracks.map(favoriteTrack => favoriteTrack.externalId);
		playlist.tracks.forEach(track => {
			track.isFavorite = favoriteTrackExternalIds.includes(track.externalId);
		});
	}

	return playlist;
};

module.exports = createGetPlaylist;
