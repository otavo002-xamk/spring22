// This module is used for converting data from csv-format to
// json. The function takes csv-data as it's parameter. The
// data is split in line brakes. Then the first line (headers)
// is separated with shift() and split in colons. Each row
// is then split in colons. Each of these columns gets it's key
// -name from the corresponding header-column. Each row is then
// pushed to the json-object, which is returned.

module.exports = {

    "csvToJson": async (csvfile, cb) => {

        var obj = [];
        var rows = csvfile.split('\n');
        var headers = rows.shift().split(',');

        let i = 0;

        await rows.forEach(row => {

            var cols = row.split(',');
            let item = {};

            async function columns(columns) {
                let j = 0;
                await columns.forEach(column => {
                    item[headers[j]] = column;
                    j++;
                });
            }

            columns(cols);
            obj.push(item);
            i++;
            
        });

        cb(obj);

    }
    
};