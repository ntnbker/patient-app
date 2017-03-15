'use strict';

var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    session = require('express-session'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(session);
var async = require('async');
/**
 * Express configuration
 */
module.exports = function(app, options) {
  var env = app.get('env');

  // Check URL valid
  app.use(function(req, res, next) {
    // var validUrl = require('valid-url');
    // if (!validUrl.isUri('http://domain.sample' + req.originalUrl)){
    //   console.log('INVALID_URL', req.originalUrl);
    //   return res.send(400, 'INVALID_URL');
    // }
    next();
  });

  // Disable caching
  app.use(function noCache(req, res, next) {

    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    next();
  });

  if ('production' === env) {
    app.use(compression());
  }

  app.use('/static', express.static(path.join(config.root, 'server/static')));
  app.use(bodyParser());
  app.use(require('connect-multiparty')());
  app.use(cookieParser("lightning-secret"));


  // Access-control-allow-origin and credential
  var corsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cache-Control, organic'
  };
  app.use(cors(corsOptions));

  // Persist sessions with mongoStore
  app.use(session({
    cookie: {
      maxAge: 3600000*24*14
    },
    secret: 'Jeff the Killer',
    store: new mongoStore({
      url: config.mongo.uri
    }, function () {
      console.log('Persistent Sessions initiated');
    })
  }));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  if (options.routes) options.routes(app);

  return app;
};
