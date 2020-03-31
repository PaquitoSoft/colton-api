const path = require('path');
const mailer = require('nodemailer');

class MailEngine {
	constructor(mailConfig) {
		this.transporter = mailer.createTransport({
			host: mailConfig.host,
			port: mailConfig.port,
			secure: true,
			auth: {
				user: mailConfig.username,
				pass: mailConfig.password
			}
		});
	}

	sendEmail({
		subject,
		destination,
		template,
		data
	}) {
		// Get template
		const templateRenderer = require(path.join(__dirname, 'templates', template));
		if (!templateRenderer) {
			throw new Error(`No template with name ${template} found.`);
		}

		// Generate HTML
		const messageBody = templateRenderer(data);

		// Send message
		this.transporter.sendMail({
			from: '"COLTON music app" <coltonapplication@gmail.com>',
			to: destination,
			subject,
			html: messageBody
		});
	}
}

module.exports.MailEngine = MailEngine;
