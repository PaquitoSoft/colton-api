class Playlist {
	constructor({ id, name, owner, playbacks, isPublic, position, creationDate, tracks }) {
		this.id = id;
		this.name = name;
		this.owner = owner;
		this.playbacks = playbacks;
		this.isPublic = isPublic;
		this.position = position;
		this.creationDate = creationDate;
		this.tracks = tracks;
	}
}

module.exports = Playlist;
