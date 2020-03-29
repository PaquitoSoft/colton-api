const toggleUserFavoriteTrack = ({ favoriteTracksRepository }) => ({ userEmail }) => {
	return favoriteTracksRepository.getUserFavoriteTracks({ userEmail });
};

module.exports = toggleUserFavoriteTrack;
