class User {
	constructor({ id, password, email, nickname, role, preferredAudioQuality	}) {
		this.id = id;
		this.password = password;
		this.email = email;
		this.nickname = nickname;
		this.role = role;
		this.preferredAudioQuality = preferredAudioQuality;
	}
}

module.exports = User;
