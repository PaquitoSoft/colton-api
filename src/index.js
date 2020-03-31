require('dotenv').config();
const log = require('debug')('colton:AppEntryPoint');

const { createServer } = require('./infrastructure/webserver/graphql-server');
const { connectToMongo } = require('./infrastructure/database/mongoose');
const { MailProvider } = require('./infrastructure/mailing/mail-provider');

const MONGO_URL = process.env.COLTON_MONGODB_URL;
const SERVER_LISTENING_PORT = process.env.COLTON_LISTENING_PORT || process.env.PORT;
const AUTH_SIGNATURE = process.env.COLTON_AUTH_SIGNATURE;
const MAIL_HOST = process.env.COLTON_MAIL_HOST;
const MAIL_PORT = process.env.COLTON_MAIL_PORT;
const MAIL_USERNAME = process.env.COLTON_MAIL_USER;
const MAIL_PASSWORD = process.env.COLTON_MAIL_PASS;

async function start() {

	try {
		const mongoose = await connectToMongo(MONGO_URL);
		const mailProvider = new MailProvider({
			host: MAIL_HOST,
			port: MAIL_PORT,
			username: MAIL_USERNAME,
			password: MAIL_PASSWORD
		});
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
