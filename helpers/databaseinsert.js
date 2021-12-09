//const { context } = require('../main');

module.exports = {

    "insertFarmData": async (jsondata, context, cb) => {

        await context().then(db => db.collection(JSON.stringify(jsondata[0].location).replace(/("|')/gm, "")).insertMany( jsondata ));
        cb('Data inserted succesfully.');

    }
    
};