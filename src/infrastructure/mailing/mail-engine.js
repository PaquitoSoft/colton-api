const path = require('path');
// const mailer = require('nodemailer');

let transporter;


module.exports.sendEmail = function sendEmail({
	subject,
	destination,
	templateName,
	data
}) {
	// Get template
	const templateRenderer = require(path.join(__dirname, 'templates', templateName));
	if (!templateRenderer) {
		throw new Error(`No template with name ${templateName} found.`);
	}

	// Generate HTML
	const messageBody = templateRenderer(data);

	// Send message
	transporter.sendEmail({
		from: '"COLTON music app" <coltonapplication@gmail.com>',
		to: destination,
		subject,
		// text: '',
		html: messageBody
	});
};
