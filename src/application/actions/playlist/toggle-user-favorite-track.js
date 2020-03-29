const Boom = require('@hapi/boom');

const toggleUserFavoriteTrack = ({ playlistRepository }) => async ({ userEmail, track }) => {
	Reflect.deleteProperty(track, 'id');
	Reflect.deleteProperty(track, 'isFavorite');

	if (!track) {
		return Boom.badRequest('No track provided');
	}

	const favoritesPlaylist = await playlistRepository.getUserFavoritesPlaylist({ userEmail });

	if (!favoritesPlaylist) {
		const playlistData = {
			isFavoritesPlaylist: true,
			owner: userEmail,
			name: 'Favorites',
			tracks: [track]
		};

		const newModel = await playlistRepository.createPlaylist(playlistData);

		return newModel;
	}

	const favoriteTrack = favoritesPlaylist.tracks.find(_track => _track.externalId === track.externalId);

	if (favoriteTrack) {
		favoritesPlaylist.tracks = favoritesPlaylist.tracks
			.filter(_track => _track.externalId !== track.externalId);
	} else {
		favoritesPlaylist.tracks.push(track);
	}

	return playlistRepository.updatePlaylist(favoritesPlaylist);
};

module.exports = toggleUserFavoriteTrack;
