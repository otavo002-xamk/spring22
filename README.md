# spring22
DevAcademy Assignment 2022

This project enables reading and analysis of information that is stored in database. It gets information
about temperature, pH and rainFall from specific dates. The project enables user to choose the start- and
end-dates that define the time gap from which the measurements will be included. The results are printed
on a table that shows each month's average values as well as the minimum, maximum and average values of the
full time gap. The user is also enabled to choose from four different locations in which the values have
been measured as well as the sensor type, that is temperature, pH or rainFall. The project is build upon
Express framework.

The entry file of the project is main.js. _tests_ folder holds the test files as well as the module for
running the test database in memory. helpers folder holds the modules for database operations and calculations.
styles folder holds the css stylesheet. views folder holds the view template file.

Follow these steps to run the project:

1. First and foremost the Node.js environment is required to be installed for this project to run. When
Node.js is installed successfully, open cmd and run 'npm install' in this project's root directory. This
will install the dependencies specified in the package.json file.

2. The project uses MongoDB, and therefore that
should be installed as well.

3. Also the measured data that we want to read should also be stored in the
database before it can be utilized.

4. Create a .env file to the project's root directory where you must declare a 'DB' and 'DBURL', for example:

DBURL = mongodb://127.0.0.1:27017/db

DB = farm_data

After succesfully going through the previously described steps, run
'node main' in cmd in the root of this project's root directory. This will start the server in gate 9000.
Open your browser and type localhost:9000. The Farm Data Analyzer should open on the screen.

For testing, run 'npm test' to run all tests or 'npm test [test-file-name]' to run a single test file.

The project uses express and mongodb npm modules. Ejs is used as a template-engine. Jest is used as a
testing framework. For testing, mongodb-memory-server is used as an in-memory database.

License: MIT
