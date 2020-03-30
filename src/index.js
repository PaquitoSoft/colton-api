const log = require('debug')('colton:AppEntryPoint');

const { createServer } = require('./infrastructure/webserver/graphql-server');
const { connectToMongo } = require('./infrastructure/database/mongoose');
const { MailProvider } = require('./infrastructure/mailing/mail-provider');

// TODO: Read from env config file
const DEFAULT_PORT_NUMBER = 4000;
const MONGO_URL = process.env.COLTON_MONGODB_URL;
const SERVER_LISTENING_PORT = process.env.COLTON_LISTENING_PORT || process.env.PORT || DEFAULT_PORT_NUMBER;
const AUTH_SIGNATURE = process.env.COLTON_AUTH_SIGNATURE || 'fjasdfhjdgsfjasdfjgsadfhdvschkjas';

async function start() {

	try {
		const mongoose = await connectToMongo(MONGO_URL);
		const mailProvider = new MailProvider();
		const server = createServer({
			mongoose,
			mailProvider,
			authSignature: AUTH_SIGNATURE
		});

		const {
			url,
			subscriptionsPath
		} = await server.listen({ port: SERVER_LISTENING_PORT });

		log('Application started!');
		log('Listening URL:', url);
		log('Subscription path:', subscriptionsPath);
	} catch (error) {
		log('Could not start application:', error);
		throw error;
	}
}

start();
