var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'forumdb'
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 8080;


//Routing

const routes = require('./routes/index.js');
const routes_public = require('./routes/public.index.js');
app.use('/api', routes);
app.use('/', routes_public);


//Start server

app.listen(port);
console.log("Express server listening on port " + port);
