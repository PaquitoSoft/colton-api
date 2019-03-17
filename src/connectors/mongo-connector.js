const { MongoClient, Logger } = require('mongodb');

module.exports = async (entities, mongoUrl) => {
    const db = await MongoClient.connect(mongoUrl);
    let logCount = 0;

    Logger.setCurrentLogger(msg => {
        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-plusplus
        console.log(`MONGODB REQUEST ${++logCount}: ${msg}`);
    });
    Logger.setLevel('debug');
    // eslint-disable-next-line array-element-newline
    Logger.filter('class', ['Cursor', 'Db', 'Mongos']);

    const collectionsMap = entities.reduce((map, entity) => {
        const entityName = `${entity.name}s`;

        map[entityName] = db.collection(entityName.toLowerCase());
        return map;
    }, {});

    return collectionsMap;
};