// This test-module tests 'datainsert.js'-module. A test array is first created with two json-objects. An in-memory-mongodatabase instance
// is initiated with 'testdatabase.js'-module's 'dataBaseConnect()'-operation. The uri that is returned is then injected as a parameter to
// the datainsert's insertFarmData()-function. In the first of the two assertions the count of objects in the returning data should be 2.
// In the second assertion we use the find()-method to get all documents from the 'Kotka'-collection and then compare the 'value'-field
// of the second document to 'mikkeli'. They should match.

const datainsert = require('../helpers/databaseinsert');
const mongodb = require('mongodb');
const { dataBaseConnect, context, closeDatabase } = require('./config/testdatabase');
const { afterAll, describe } = require('jest-circus');

let testobject = [
                    {
                        location: 'Kotka',
                        datetime: '1.1.2011',
                        sensorType: '12:11',
                        value: 'kotka'
                    },
                    {
                        location: 'Kotka',
                        datetime: '1.4.2014',
                        sensorType: '12:14',
                        value: 'mikkeli'
                    }
                ];


afterAll(async () => await closeDatabase());

describe('database insert test', () => {
    test('should insert data', async () => {
        let connection_uri;
        await dataBaseConnect().then(uri => connection_uri = uri);
        expect.assertions(2);
        let confirmation, results;
        await datainsert.insertFarmData(testobject, context, connection_uri, data => {
            confirmation = data;
        });
        let test_collection = await context(connection_uri).then(db => db.collection('Kotka').find({}).toArray()).then(result => results = result);
        expect(confirmation.insertedCount).toEqual(2);
        expect(test_collection[1].value).toEqual('mikkeli');
    });
});