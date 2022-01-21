// This module tests datatoanalyze.js module. First a test object array is created that holds two test objects containing location, datetime,
// sensorType and value fields. Then a test result object is created that holds datetime and value values from the test object array and a
// minimum, maximum and average values that are calculated from it. Then also a test request body object is created. The database connection
// is established with the help of testdatabase module's dataBaseConnect and context methods and closed with the closeDatabase method. The
// getDataToAnalyze()-function is tested by passing it the test request body object that holds the arbitrary start and end dates as well as
// the location and sensorType properties from the first test object to the select_farm and sensorType fields correspondingly. The result
// should match the test result object.

const datatoanalyze = require('../helpers/datatoanalyze');
const { dataBaseConnect, context, closeDatabase } = require('./config/testdatabase');
const { afterAll, describe } = require('jest-circus');

jest.setTimeout(20000);

let testobject = [
    {
        location: 'Kotka',
        datetime: '2018-11-11',
        sensorType: 'temperature',
        value: '-3.11'
    },
    {
        location: 'Kotka',
        datetime: '2019-01-01',
        sensorType: 'temperature',
        value: '2.20'
    }
];

let testresult = {
    response: [
        {
            datetime: testobject[0].datetime,
            value: testobject[0].value
        },
        {
            datetime: testobject[1].datetime,
            value: testobject[1].value
        }
    ],
    avg: -0.45,
    min: testobject[0].value,
    max: testobject[1].value
};

let test_request_body = {
    "select_farm": testobject[0].location,
    "start_date": "2018-10-10",
    "end_date": "2019-02-05",
    "sensorType": testobject[0].sensorType
};

afterAll(async () => await closeDatabase());

describe('test for getting a data to analyze', () => {
    test('should get data to analyze', async () => {
        let connection_uri, confirmation;
        await dataBaseConnect().then(uri => connection_uri = uri);
        await context(connection_uri).then(db => db.collection(JSON.stringify(testobject[0].location).replace(/("|')/gm, "")).insertMany( testobject ));
        await datatoanalyze.getDataToAnalyze(test_request_body, context, connection_uri, data => {
            confirmation = data;
        });
        expect(confirmation).toEqual(testresult);
    });
});