const createGetUserPlaylistsAction = ({ playlistRepository }) => ({ userEmail }) =>
    playlistRepository.getUserPlaylists(userEmail);

module.exports = createGetUserPlaylistsAction;
