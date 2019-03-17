const Boom = require('boom');

module.expots.getUser = async (authToken, UserCollection) => {
    if (!authToken) {
        throw Boom.unauthorized('Needs login');
    }

    const user = await UserCollection.findOne();

    if (!user) {
        throw Boom.unauthorized('Provided authToken does not correspond to any user');
    }

    return user;
};