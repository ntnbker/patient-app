'use strict';
var User = __mongodb.model('user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findOne({_id: _id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done('UNREGISTERED_USER');
      }
      if (!user.authenticate(password)) {
        return done('WRONG_PASSWORD');
      }
      return done(null, user);
    });
  }
));

module.exports = passport;
