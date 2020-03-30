class MailProvider {
	constructor(mailEngine) {
		this.engine = mailEngine;
	}

	sendResetUserPasswordMail({ userEmail, newPassword }) {
		this.engine.sendEmail({
			subject: 'COLTON: Password recovery',
			destination: userEmail,
			template: 'reset-user-password-template.js',
			data: { newPassword }
		});
	}
}

module.exports.MailProvider = MailProvider;
