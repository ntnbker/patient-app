var async = require('async');
var crypto = require('crypto');
var request = require('request');
var config = __config;
var passport = require('passport');
var fs = require('fs');
var jwt = require('jsonwebtoken');

function addAuthTokenToUserInfo (userInfo) {
 var token = jwt.sign(userInfo, config.socketio.jwtSecret, {expiresIn: 3600});
 userInfo.token = token;
 return userInfo;
}

exports.logout = function (req, res) {
  req.logout();
  res.json({});
};

exports.login = function(req, res, next) {
  var strategy = req.auth.strategy || 'local';
  passport.authenticate(strategy, function(err, user, info) {
    if (err || !user) return res.status(400).send({
      error: err,
      info: info
    });

    req.logIn(user, function(err) {
      if (err) {
        return res.send(400, err);
      }
      var userInfo = user.userInfo();
      res.send(200, userInfo);

    });
  })(req, res, next);

}
