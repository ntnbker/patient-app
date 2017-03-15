'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__base = __dirname + '/';
global.__config = require(__base + 'server/config/config');
global.__p2c = require('promise-to-callback');
global.__async = require('async');
var sqldb = require(__base + 'server/services/sqldb');

// Connect to MongoDB.
sqldb.connect(function(err, db) {
  console.log("Postgres connected");
  var workerType = process.env.WORKER_TYPE || 'normal'
  console.log("Worker running...");
});
