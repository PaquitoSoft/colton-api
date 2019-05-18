const mongoose = require('mongoose');

module.exports.connect = function connect(mongoUrl) {
    return new Promise((resolve, reject) => {
        const { connection } = mongoose;

        connection.on('error', reject);
        connection.once('open', resolve);

        mongoose.connect(mongoUrl, { useNewUrlParser: true });
    });
};
