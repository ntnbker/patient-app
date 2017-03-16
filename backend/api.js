var express = require('express'),
    http = require('http');

var config = __config;

// Setup Express

var app = express();
require(__base + 'api/config/express')(app);

module.exports = app;
