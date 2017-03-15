'use strict';

var fs = require('fs');

// var os = require('os');
// var ifaces = os.networkInterfaces();

//var getIP = require('ipware')().get_ip;

//var requestIp = require('request-ip');

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */

  userAuth: function(req, res, next) {
    // return next();
    if (req.user) return next();
    res.send(401);
  },

  editorAuth: function(req, res, next) {
    if (req.isAuthenticated() &&
      (req.user.role === 'editor' || req.user.role === 'admin')) return next();

    res.send(401);
  },

  adminAuth: function(req, res, next) {

    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.send(401);
  },

  editorRestrictCheck: function(req, res, next) {
    if (req.user && req.user.status && req.user.status.indexOf('editor_restricted')>=0) return res.send(403);
    next();
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  },

  resourcesRouting: function(req, res, next) {
    var locale = process.env.LOCALE;
    fs.stat(__base + 'lib/static/resources/' + locale + '_' + req.params.resourceName, function(err, stat) {
        if(err == null) {
          return res.redirect('/static/resources/' + locale + '_' + req.params.resourceName);
        }
        return res.redirect('/static/resources/' + req.params.resourceName);
    });
  },

  taskStatus: function(req, res, next) {
    var params = req.params;
    if (!params.taskStatusKey) return res.send(400, 'KEY_MISSING');
    var key = params.taskStatusKey;
    redis.getJSON(key, function(err, result) {
      if (err) return res.send(400, err);
      if (!result) return res.send(404, 'TASK_NOT_FOUND');
      switch(result.status.toUpperCase()) {
        case 'PROCESSING':
          res.send(202, result.data);
          break;
        case 'ERROR':
          res.send(410, result.error);
          break;
        case 'SUCCESS':
          res.send(200, result.result);
          break;
        default:
          res.send(400, 'INVALID_STATUS');
      }
    })
  },

  logIP: function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
    console.log (req.headers);
    console.log (ip);

    // Object.keys(ifaces).forEach(function (ifname) {
    //   var alias = 0;
    //
    //   ifaces[ifname].forEach(function (iface) {
    //     if ('IPv4' !== iface.family || iface.internal !== false) {
    //       // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    //       return;
    //     }
    //
    //     if (alias >= 1) {
    //       // this single interface has multiple ipv4 addresses
    //       console.log(ifname + ':' + alias, iface.address);
    //     } else {
    //       // this interface has only one ipv4 adress
    //       console.log(ifname, iface.address);
    //     }
    //     ++alias;
    //     var ip = iface.address;
    //
    //
    //   });
    // });

    // var ip = getIP(req).clientIp;

    // var ip = requestIp.getClientIp(req);
    // console.log(ip);
    //count number of request
    redis.increase (ip, function (err, result) {

      if (err) return res.send (400, err);
      else {
        console.log ("key: " + ip + " " + result);
        next();
      }
    })

  }
};
