// This module tests monthlyavgs.js module. The first function in the module takes a test json object for
// it's parameter and then calculates the average values for each object inside each item's docs array.
// This is needed to set the testresult array's average values correctly. The json_data array is inserted
// as the first argument to the calculateMonthlyAverages() function. Also the start- and end-dates are
// inserted to the function as arguments. The result for the calculateMonthlyAverages() function is expected
// to be equal to the test result array.

const monthlyavgs = require('../helpers/monthlyavgs');
const { describe } = require('jest-circus');

const calculateAvg = async (test) => {
    await test.forEach(async item => {
        try {
            let sum = 0;
            await item.docs.forEach(obj => {
                sum += Number(obj.value);
            });
            item.avg = (sum / item.docs.length).toFixed(2);
        } catch (err) {
            item.avg = 'NaN';
        }
    });
}

let json_data = [
    { datetime: '2018-11-11', value: '-3.11' },
    { datetime: '2019-01-01', value: '2.20' },
    { datetime: '2019-01-21', value: '4.75' },
    { datetime: '2019-01-23', value: '1.11' }
];

let testresult = [
    {
        "year": '2018', "month": '10', "docs": [], "avg": 'NaN'
    },
    {
        "year": '2018', "month": '11', "docs": [ json_data[0] ], "avg": 'NaN'
    },
    {
        "year": '2018', "month": '12', "docs": [], "avg": 'NaN'
    },
    {
        "year": '2019', "month": '01', "docs": [ json_data[1], json_data[2], json_data[3] ], "avg": 'NaN'
    },
    {
        "year": '2019', "month": '02', "docs": [], "avg": 'NaN'
    },
];

let start_date = '2018-10-10';
let end_date = '2019-02-05';

describe('test for calculating the monthly averages', () => {
    test('should get the monthly averages calculated', async () => {
        await calculateAvg(testresult);
        let mdocuments;
        await monthlyavgs.calculateMonthlyAverages(json_data, start_date, end_date, data => mdocuments = data);
        expect(mdocuments).toEqual(testresult);
    });
});