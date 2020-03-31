const { MailEngine } = require('./mail-engine');

class MailProvider {
	constructor(mailConfig) {
		this.engine = new MailEngine(mailConfig);
	}

	sendResetUserPasswordEmail({ userEmail, newPassword }) {
		this.engine.sendEmail({
			subject: 'COLTON: Password recovery',
			destination: userEmail,
			template: 'reset-user-password-template.js',
			data: { newPassword }
		});
	}
}

module.exports.MailProvider = MailProvider;
