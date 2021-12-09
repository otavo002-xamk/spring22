var express = require('express');
var app = express();
const mongodb = require('mongodb');
const dburl = 'mongodb://127.0.0.1:27017/db';
var path = require('path');
const fs = require('fs');

const csvtojson = require('./helpers/csvtojsonconvert');
const datainsert = require('./helpers/databaseinsert');

const context = () => mongodb.MongoClient.connect(dburl,
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(client => client.db('farm_data'));

module.exports = { context };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const files = [
    fs.readFileSync(__dirname + '/files/friman_metsola.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/Nooras_farm.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/ossi_farm.csv', 'utf8'),
    fs.readFileSync(__dirname + '/files/PartialTech.csv', 'utf8')
];

app.get('/', (req, res) => {

    files.forEach(async file => {
        await csvtojson.csvToJson(file, data => {
            datainsert.insertFarmData(data, context, (confirmation) => {
            });
        });
    });
    
    res.send('done');

});

app.listen(9000);