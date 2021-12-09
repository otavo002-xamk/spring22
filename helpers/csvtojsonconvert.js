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

            async function concatenateColumns(columns) {
                let items = 
                await columns.forEach(column => {

                });
            }
            columns(cols);
            obj.push(item);
            i++;
        });

        cb(obj);

    }
    
};