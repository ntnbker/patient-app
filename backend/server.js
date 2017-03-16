'use strict';

// Register root path
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__base = __dirname + '/';
global.__config = require(__base + 'server/config/config');
global.__p2c = require('promise-to-callback');
global.__async = require('async');
global.__mongodb = require(__base + 'server/services/mongodb');

__mongodb.init();
require(__base + 'server/config/passport');
var express = require('express');
// var sqldb = require(__base + 'server/services/sqldb');

// Bootstrap models

// Create our Express application

// Select the right server.
var server;
console.log('SERVER MODE: ' + __config.serverMode);

switch (__config.serverMode) {
    default: server = require(__base + 'api');
    break;
}

// Run server immediately to assist testing.

// Connect to MongoDB.
__mongodb.connect(__config.mongo.uri, __config.mongo.options, function(err) {
  console.log("Mongoose connected", err);
  // sqldb.connect(function(err, db) {
  //     console.log("Postgres connected", err);
      console.log('SERVER_TIME', new Date().toString());
      /*if (process.env.NODE_ENV != 'test') */
      start();
  // })
  
});

function start() {
  server.listen(__config.port, __config.ip, function () {
    console.log('HTTP server listening on %s:%d, in %s mode', __config.ip, __config.port, server.get('env'));
  });
}

module.exports = server;
