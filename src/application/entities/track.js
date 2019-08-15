class Track {
	constructor({ id, externalId, title, duration, rating }) {
		this.id = id;
		this.externalId = externalId;
		this.title = title;
		this.duration = duration;
		this.rating = rating;
	}
}

module.exports = Track;
