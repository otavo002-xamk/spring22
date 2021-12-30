// This module tests "csvtojsonconvert.js"-module. A test object is first created,
// which is identical to the data in a test-csv-file. The test-csv-file is first
// read with fs-module's readFileSync-operation. The result is then injected to
// the csvtojsonconvert-function call as a parameter. Then the data that is returned
// is compared with the data in the test object. The test asserts them to be equal.

const csvtojson = require('../helpers/csvtojsonconvert');
const fs = require('fs');

let testobject = {
                    location: 'Mikkeli',
                    datetime: '2022-1-1',
                    sensorType: 'pH',
                    value: '4\r'
                };

describe('csv to json convertion test', () => {
    test('should return json-object', async () => {
        let file = fs.readFileSync(__dirname + '/files/lintuluettelo.csv', 'utf8');
        let result;
        await csvtojson.csvToJson(file, data => {
            result = data;
        });
        expect(result[2]).toEqual(testobject);
    });
});