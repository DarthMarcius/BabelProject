var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var mongoConnectionURL = "mongodb://localhost:27017/issue_tracker";
var handlebars  = require('express-handlebars');

var resources = {
    'app': app, 
    'handlebars': handlebars,
    'MongoClient': MongoClient,
    'mongoConnectionURL': mongoConnectionURL
};

var router = require('./server/helpers.js').listenToRoutes(resources);
app.use(express.static('public'));

app.listen(3000);