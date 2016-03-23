"use strict";

var path = require("path");
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var appRoot = path.normalize(path.resolve(__dirname));
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var mongoConnectionURL = "mongodb://localhost:27017/issue_tracker";
var handlebars  = require('express-handlebars');

app.use(express.static('public'));

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge:60000 * 3}
}));
app.use(passport.initialize());
app.use(passport.session());

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
