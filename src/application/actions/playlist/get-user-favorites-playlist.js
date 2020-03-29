const createGetUserFavoritesPlaylist = ({ playlistRepository }) => ({ userEmail }) => {
	return playlistRepository.getUserFavoritesPlaylist({ userEmail });
};

module.exports = createGetUserFavoritesPlaylist;
