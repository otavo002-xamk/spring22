// This module is used to create an in-memory-mongodatabase-instance with MongoMemoryServer.
// The dataBaseConnect() creates a new MongoMemoryServer instance and returns it's uri.
// The context()-operation takes a string parameter and injects it to MongoClient's connect()
// -operation. This is used to connect to the MongoMemoryServer instance. The closeDatabase
// closes the MongoMemoryServer instance after tests are completed.

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongodb = require('mongodb');

const dataBaseConnect = async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    return uri;
}

const context = async (connection_string) => await mongodb.MongoClient.connect(connection_string,
    { useNewUrlParser: true, useUnifiedTopology: true }).then(client => client.db('test_database'));

const closeDatabase = async () => {
    await mongod.stop();
}

module.exports = { dataBaseConnect, context, closeDatabase }