// This module is used for inserting data to mongo-database. The function takes a json-data-object, context-function and a connection uri-string
// as arguments. The connection uri-string gets injected to context()-function as a parameter. Then a new database is created or found by the
// name of json-data-object's location property. The data is then inserted from the json-data-object and the response gets returned in the callback.

module.exports = {

    "insertFarmData": async (jsondata, context, connection_uri, cb) => {

        await context(connection_uri).then(db => db.collection(JSON.stringify(jsondata[0].location).replace(/("|')/gm, "")).insertMany( jsondata )).then(response => result = response);
        cb(result);

    }

}