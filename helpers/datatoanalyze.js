// This module finds datetime- and value-fields from documents the datetimes of which are in between the start- and end-dates
// specified in the request. The function takes a request's body object, a context function and a connection uri string as
// parameters. The database connection is first created with the context()-function and the connection_uri string. Then a
// find()-request is posted with the datetime and sensorType information specified in the request's body object. The sum,
// minimum, maximum and average values are extracted and calculated from the query's response data. Empty or null values are
// rejected as well as too large or too small values. The query's response object, average, minimum maximum values are returned
// in the callback.

module.exports = {

    "getDataToAnalyze": async (rqstbody, context, connection_uri, cb) => {

        await context(connection_uri).then(db => db.collection(rqstbody.select_farm)
            .find({
                    datetime: {
                                $gt: rqstbody.start_date,
                                $lt: rqstbody.end_date
                            },
                    sensorType: rqstbody.sensorType
            },
            {
                projection: {
                    "_id": 0,
                    "location": 0,
                    "sensorType": 0,
                }
            }).toArray()).then(async response => {
            let sum = 0;
            let min = 10000;
            let max = -10000;
            await response.forEach(element => {
                if (element.value != 'NULL' && element.value != '') {
                    if (rqstbody.sensorType == "temperature") {
                        if (element.value > -50 && element.value < 100) {
                            sum += parseFloat(element.value);
                            if (element.value * 1000 < min * 1000) min = element.value;
                            if (element.value * 1000 > max * 1000) max = element.value;
                        }
                    } else if (rqstbody.sensorType == "pH") {
                        if (element.value >= 0 && element.value <= 14) {
                            sum += parseFloat(element.value);
                            if (element.value * 1000 < min * 1000) min = element.value;
                            if (element.value * 1000 > max * 1000) max = element.value;
                        }
                    } else if (rqstbody.sensorType == "rainFall") {
                        if (element.value >= 0 && element.value <= 500) {
                            sum += parseFloat(element.value);
                            if (element.value * 1000 < min * 1000) min = element.value;
                            if (element.value * 1000 > max * 1000) max = element.value;
                        }
                    }
                }
            });
            if (rqstbody.sensorType == "pH") {
                let avg = parseFloat((sum / response.length).toFixed(1));
                cb({ response, avg, min, max });
            } else {
                let avg = parseFloat((sum / response.length).toFixed(2));
                cb({ response, avg, min, max });                
            }
        });

    }

}