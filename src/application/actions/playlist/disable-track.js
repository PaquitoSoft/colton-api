const createDisableTrack = ({ playlistRepository }) => async ({ trackExternalId, userEmail }) => {
	const playlists = await playlistRepository.getUserPlaylistsWithTrack({ trackExternalId, userEmail });

	// TODO Possible alternative
	// db.collection.update(
	// 	{ },
	// 	{ "$set": { "aggregations.$[].full": true }}
	//   )

	const tasks = playlists.map(playlist => {
		playlist.tracks.some(track => {
			if (track.externalId === trackExternalId) {
				track.isDisabled = true;
				return true;
			}
			return false;
		});
		return playlistRepository.updatePlaylist(playlist);
	});

	return Promise.all(tasks);
};

module.exports = createDisableTrack;
