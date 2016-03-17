"use strict";

var path = require("path");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var appRoot = path.normalize(path.resolve(__dirname));
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');
var mongoConnectionURL = "mongodb://localhost:27017/issue_tracker";
var handlebars  = require('express-handlebars');

var resources = {
    'app': app,
    'handlebars': handlebars,
    'mongoose': mongoose,
    'mongoConnectionURL': mongoConnectionURL,
    'appRoot': appRoot,
    'path': path,
    'passport': passport,
    'LocalStrategy': LocalStrategy,
    'bcrypt': bcrypt
};

var router = require('./server/helpers.js').init(resources);
app.use(express.static('public'));

app.listen(3000);
