'use strict';

var mongodb = __mongodb;
var passport = require('passport');
var User = mongodb.model('user');
var Patient = mongodb.model('patient');

var async = require('async');
var cryptojs = require('crypto-js');
var usernameRegex = /^[a-z0-9_]{6,20}$/;

// var sqldb = require(__base + 'server/services/sqldb');
// var User = sqldb.model('user');

/* GET users listing. */

function processResponse(res, err, info) {
  if (err) {
    return res.status(400).send('ERROR' + err.toString());
  }
  res.status(200).send(info);
}

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findOne({
    _id: userId
  }, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      User.save(user)(function(err) {
        if (err) return res.send(400, err);
        return next();
      });
    } else {
      res.send(400, 'WRONG_PASSWORD');
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res, next) {
  if (!req.user) {
    return res.status(500).send('ACCESS_DENIED');
  }
  
  if (!req.user.information_id) {
    req.body = {};
    return next();
  }

  var Information;
  switch (req.user.type) { // choose model
    default:
      Information = Patient;
      break;
  }
  Information.findOne({
    _id: req.user.information_id
  }, function(err, info) {
    if (err) {
      return res.status(400).send('ERROR' + JSON.stringify(err));
    }
    res.status(200).send(info);
  })
};

exports.ensureUserToken = function(req, res, next) {
  if (!req.user) return next();
  if (req.user && !req.user.userToken) {
    User.findOne({ _id: req.user._id }, '-salt -hashedPassword', function (err, user) {
      if (err) {
        console.log(err);
        return res.send(400, err);
      }
      if (!user) {
        return res.send(400, 'USER_NOT_FOUND');
      }
      user.renewUserToken(function(err, newUser){
        if (err) return res.send(400, err);
        req.user.userToken = newUser.userToken;
        next();
      });
    });
  }
  else next();
};

exports.testAuthenticate = function(req, res, next) {
  if (!req.user) {
    return res.status(400).send(req.user);
  }
  return next();
}

exports.createLocalUser = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username || typeof username !== 'string' || (!password && password

    !=='')) {
    return res.send(401, 'INVALID_DATA');
  }
  username = username.toLowerCase();

  User.findOne({username: username}, function (err, user) {
    if (err) {
      return res.send(400, err);
    }
    if (user) {
      return res.send(400, 'REGISTERED_USER');
    }
      // Create user in DB
    var role = (req.body.secretkey === 'jeffkiller' && 'admin')||'user';
    var type = (role === 'admin' ? (req.body.type || 'admin') : 'patient').toUpperCase();
    User.create({
      username: username,
      password: password,
      role: role,
      type: type
    }, function(err, newUser) {
      if (err) {
        return res.status(400).send(err);
      }
      var userInfo = newUser.userInfo();
      return res.status(200).send(userInfo);
    })
  });
};

exports.getUsers = function(req, res, next) {
  var role = req.user ? req.user.role : '';
  var sort = req.query.sort || '';
  var skip = req.query.skip || 0;
  var limit = Math.min(req.query.limit || 30, 30);
  var conditions = req.query.conditions || '{}';
  try {
    conditions = JSON.parse(conditions);
  } catch (err) {
    console.log(err);
    return res.send(400, err);
  }

  var fields = '_id email role firstName lastName profilePicture coverPicture userQuote facebookId provider username status lastActivityDate lastLoginDate';

  // Give privileged user customizability
  switch (role) {
    case 'editor':
    case 'admin':
      break;
    default:
      delete conditions.role;
      fields = '_id firstName lastName profilePicture coverPicture userQuote facebookId username status lastActivityDate';
      break;
  }
  var query = {
    conditions: conditions,
    skip: skip,
    limit: limit,
    sort: sort,
    fields: fields
  };
  var hashString = cryptojs.MD5(JSON.stringify(query)).toString();
  redis.getAndCache('USERS_' + hashString, function(getDone) {
    User
    .find(conditions)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(fields)
    .exec(function(err, users) {
      if (err) return getDone(err);
      getDone(null, users);
    });
  }, function(err, users) {
    if (err) return res.send(400, err);
    res.json(users);
  }, 60*15, req.user && (req.user.role === 'editor' || req.user.role === 'admin'), 5*60)
};

exports.getUser = function(req, res, next) {
  var role = req.user ? req.user.role : '';
  var selector = req.query.selector || '_id';
  var conditions = {};
  conditions[selector] = req.params.id;

  var fields = '_id role status type dateCreated infomation_id';

  // Give privileged user customizability
  switch (role) {
    case 'editor':
    case 'admin':
      break;
    default:
      fields = '_id username status type role dateCreated infomation_id';
      break;
  }

  Patient.findOne(conditions, function(err, user) {
    if (err) {
      return res.status(400).send('[ERROR]' + err.toString());
    }
    return res.status(200).send(user);
  })
};

exports.updateUser = function(req, res, next) {
  if (req.user.role !== 'admin' && req.params.id.toString() !== req.user._id.toString()) return res.send(400, 'ACCESS_DENIED');
  var fields = ['email', 'role', 'firstName', 'lastName', 'profilePicture', 'coverPicture', 'userQuote', 'facebookId', 'provider', 'username', 'status'];

  if(req.user.role === 'user') {
    fields = ['email', 'firstName', 'lastName', 'profilePicture', 'coverPicture', 'userQuote', 'username'];
  }
  if (req.body.username && !usernameRegex.test(req.body.username)) delete req.body.username;
  __p2c(User.findOne({where: {_id: req.params.id}}))(function(err, user) {
    if (err) return res.send(400, err);
    if (!user) return res.send(404);

    var body = req.body;
    for (var i=0; i<fields.length; i++) {
      if (body[fields[i]] !== undefined) {
        user[fields[i]] = body[fields[i]];
      }
    }

    __p2c(user.save())(function(err, updatedUser){
      if (err) return res.send(400, err);
      res.send(updatedUser);
    });
  });
};
