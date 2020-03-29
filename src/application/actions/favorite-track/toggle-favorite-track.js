const Boom = require('@hapi/boom');

const toggleUserFavoriteTrack = ({ favoriteTracksRepository }) => async ({ userEmail, track }) => {
	Reflect.deleteProperty(track, 'id');
	Reflect.deleteProperty(track, 'isFavorite');

	if (!track) {
		return Boom.badRequest('No track provided');
	}

	const favoriteTracks = await favoriteTracksRepository.getUserFavoriteTracks({ userEmail });

	if (!favoriteTracks) {
		const newFavoriteTracks = {
			owner: userEmail,
			creationDate: Date.now(),
			tracks: [track]
		};

		const newModel = await favoriteTracksRepository.createUserFavoriteTracks(newFavoriteTracks);

		return newModel;
	}

	const favoriteTrack = favoriteTracks.tracks.find(_track => _track.externalId === track.externalId);

	if (favoriteTrack) {
		favoriteTracks.tracks = favoriteTracks.tracks
			.filter(_track => _track.externalId !== track.externalId);
	} else {
		favoriteTracks.tracks.push(track);
	}

	return favoriteTracksRepository.updateUserFavoriteTracks(favoriteTracks);
};

module.exports = toggleUserFavoriteTrack;
