var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var handlebars  = require('express-handlebars');
var router = require('./server/helpers.js').listenToRoutes(app, handlebars);
app.use(express.static('public'));

app.listen(3000);