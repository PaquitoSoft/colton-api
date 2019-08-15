const mongoose = require('mongoose');

module.exports.connectToMongo = function connectToMongo(mongoUrl) {
	return new Promise((resolve, reject) => {
		const { connection } = mongoose;

		connection.on('error', reject);
		connection.once('open', () => {
			resolve(mongoose);
		});

		mongoose.connect(mongoUrl, { useNewUrlParser: true });
	});
};
