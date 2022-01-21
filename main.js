var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const mongodb = require('mongodb');
var path = require('path');
const fs = require('fs');

const datatoanalyze = require('./helpers/datatoanalyze');
const monthlyavgs = require('./helpers/monthlyavgs');
const chartcreation = require('./helpers/chartcreation');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));

require('dotenv').config(); // implements environment variables to the process-environment from the .env-file.

const context = async (dburl) => await mongodb.MongoClient.connect(dburl, // creates a database connection with MongoClient, takes a url as a parameter
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(client => client.db(process.env.DB));                            // takes a database name from the process-environment as a parameter

app.use("/styles", express.static(__dirname + "/styles")); // sets a static stylesheet file folder
app.set('view engine', 'ejs');                          // sets up ejs as a template-engine
app.set('views', path.join(__dirname, 'views'));        // sets template-file folder
app.use("/images", express.static(__dirname + "/images")); // sets a static image-file folder

app.get('/', (req, res) => {                            // The root path: renders index page
    res.render('index', { "result": null });
});

// sends a request that holds the farm, the starting and ending dates and the sensor type,
// gets the data from the database, calculates the monthly average values of the sensor data,
// creates a chart from the average values of each month,
// then renders the index page with the information
app.post('/getstatistics', (req, res) => {
    datatoanalyze.getDataToAnalyze(req.body, context, process.env.DBURL, data => {
        monthlyavgs.calculateMonthlyAverages(data.response, req.body.start_date, req.body.end_date, mdocuments => {
            chartcreation.createChart(mdocuments, () => {
                res.render('index', {
                                    "farm": req.body.select_farm,
                                    "sensortype": req.body.sensorType,
                                    "startdate": req.body.start_date,
                                    "enddate": req.body.end_date,
                                    "result": {
                                                "min": data.min,
                                                "max": data.max,
                                                "average": data.avg
                                    },
                                    "monthly_documents": mdocuments
                });
            });
        });
    });
});

app.listen(9000);