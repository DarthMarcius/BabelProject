"use strict";

let path = require("path");
let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let app = express();
let ioServer = require('http').Server(app);
let io = require('socket.io')(ioServer);
let appRoot = path.normalize(path.resolve(__dirname));
let passport = require('passport');
let flash = require('connect-flash');
let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt-nodejs');
let expressSession = require('express-session');
let mongoose = require('mongoose');
let mongoConnectionURL = process.env.DATABASE_URL || "mongodb://localhost:27017/issue_tracker";
let handlebars  = require('express-handlebars');
let eventEmitter = require('events').EventEmitter;

let port = process.env.PORT || 3000;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Pass to next layer of middleware
    next();
});

app.use(express.static('public'));

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// parse application/json

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge:60000 * 3}
}));
app.use(passport.initialize());
app.use(passport.session());

let resources = {
    'app': app,
    'handlebars': handlebars,
    'mongoose': mongoose,
    'mongoConnectionURL': mongoConnectionURL,
    'appRoot': appRoot,
    'path': path,
    'passport': passport,
    'LocalStrategy': LocalStrategy,
    'bcrypt': bcrypt,
    'eventEmitter': eventEmitter,
    'io': io,
    'port': port
};

var router = require('./server/helpers.js').init(resources);
app.use(express.static('public'));

ioServer.listen(port);
