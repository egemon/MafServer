#!/bin/env node
// rprocess.env.NODE_ENV = 'production';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
var isDev = process.env.NODE_ENV !== 'production';
var CONFIG = require('./configs/serverConfig.json');
var express = require('express'),
    app = express();
var compress = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = require('./routes/router');


// view engine setup
app.set('views', path.join(__dirname, (isDev ? 'client' : 'public')));

app.use(compress(CONFIG));
app.use(favicon(__dirname + (isDev ? '/client/favicon.ico': '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, (isDev ? '/client': '/public'))));
app.use(express.static(path.join(__dirname, (isDev ? '/client/img': '/client/img'))));

app.use('/', router);

app.engine('html', require('ejs').renderFile);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        console.log('Error!', err);
        res.status(err.status || 500);
        res.send({
            err: JSON.stringify(err)
        });
    });

module.exports = app;

//  Set the environment variables we need.
var ipaddress = process.env.IP;
var port      = process.env.PORT || 8080;

if (typeof ipaddress === "undefined") {
    ipaddress = "0.0.0.0";
}



app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
    Date(Date.now() ), ipaddress, port);
});

