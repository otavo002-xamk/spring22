// This module is used for calculating the monthly averages of the sensor data received
// from the database in the previous module. The function takes a json data object and
// start and end date strings as parameters. For every month between the start and end
// dates in the request, a json object is created which is then pushed to an array that
// will hold all the objects for each month. After the array is created, each of the
// sub-objects in the json data object is pushed to the array which holds the monthly
// objects into the docs array inside of the object the month and year of which match
// the objects corresponding fields. An average value is calculated for each month
// and is updated for each month's document. Monthly data array is returned in the
// callback.

module.exports = {

    "calculateMonthlyAverages": async (jsondata, start_date, end_date, cb) => {

        const year_and_month = (data) => {
            let datasplit = data.split('-');
            return { 'year': datasplit[0] , 'month': datasplit[1] };
        }

        let first_month = await year_and_month(start_date);
        let last_month = await year_and_month(end_date);

        let monthlty_documents = [];
        let i = first_month.year;
        let j = first_month.month;

        while ((i <= last_month.year && j <= last_month.month) || (i < last_month.year)) {
            monthlty_documents.push({ "year": i, "month": j, "docs": [], "avg": 0 });
            j++;
            (j > 9) ? j = j.toString() : j = '0' + j;
            if (j == '13') {
                j = '01';
                i++;
                i = i.toString();
            }
        }

        await jsondata.forEach(async element => {
            let date = await year_and_month(element.datetime);
            monthlty_documents.forEach(document => {
                if (date.year == document.year && date.month == document.month) {
                    document.docs.push(element);
                    return;
                }
            });
        });

        await monthlty_documents.forEach(document => {
            document.docs.forEach(doc => {
                document.avg += Number(doc.value);
            });
            document.avg = (document.avg / document.docs.length).toFixed(2);
        });

        cb(monthlty_documents);

    }

}