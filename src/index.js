const { createServer } = require('./infrastructure/webserver/graphql-server');
const { connectToMongo } = require('./infrastructure/database/mongoose');

// TODO: Read from env config file
const DEFAULT_PORT_NUMBER = 4000;
const MONGO_URL = process.env.COLTON_MONGODB_URL || 'mongodb://colton2:DStoma23@ds029817.mongolab.com:29817/colton-dev';
const SERVER_LISTENING_PORT = process.env.COLTON_LISTENING_PORT || DEFAULT_PORT_NUMBER;
const AUTH_SIGNATURE = process.env.COLTON_AUTH_SIGNATURE || 'fjasdfhjdgsfjasdfjgsadfhdvschkjas';

async function start() {

    try {
        const mongoose = await connectToMongo(MONGO_URL);
        const server = createServer({
            mongoose,
            authSignature: AUTH_SIGNATURE
        });

        const {
            url,
            subscriptionsPath
        } = await server.listen({ port: SERVER_LISTENING_PORT });

        console.log('Application started!');
        console.log('Listening URL:', url);
        console.log('Subscription path:', subscriptionsPath);
    } catch (error) {
        console.error('Could not start application:', error);
        throw error;
    }
}

start();
