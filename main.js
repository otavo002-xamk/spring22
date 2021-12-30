var express = require('express');
var app = express();
const mongodb = require('mongodb');
var path = require('path');
const fs = require('fs');

const csvtojson = require('./helpers/csvtojsonconvert'); // This module converts data from csv file to a json-object.
const datainsert = require('./helpers/databaseinsert'); // This module inserts the data from the json-object to the database.

require('dotenv').config(); // implements environment variables to the process-environment from the .env-file.

const context = async (dburl) => await mongodb.MongoClient.connect(dburl, // creates a database connection with MongoClient, takes a url as a parameter
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(client => client.db(process.env.DB));                            // takes a database name from the process-environment as a parameter

app.set('view engine', 'ejs');                          // sets up ejs as a template-engine
app.set('views', path.join(__dirname, 'views'));        // sets template-file folder

const files = [                                                         // the csv files from where to convert json
    fs.readFileSync(__dirname + '/files/friman_metsola.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/Nooras_farm.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/ossi_farm.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/PartialTech.csv', 'utf8')
];

// The root path: For each csv-file the data gets converted to json. Then the json-data is inserted to database.
app.get('/', (req, res) => {
    files.forEach(async file => {
        await csvtojson.csvToJson(file, data => {
            datainsert.insertFarmData(data, context, process.env.DBURL, (confirmation) => {
            });
        });
    });
    res.send('done');
});

app.listen(9000);