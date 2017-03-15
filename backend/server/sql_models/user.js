
var Sequelize = require('sequelize');
var cryptojs = require('crypto-js');
var crypto = require('crypto');
var redis = require(__base + 'server/helpers/redis');

var modelStructure = {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true

  },
  username: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  hashedPassword: String,
  token: Sequelize.STRING,
  role: Sequelize.STRING,
  status: Sequelize.STRING,
  salt: Sequelize.STRING

}

var options = {
  instanceMethods: {
      renewUserToken: function() {
          var _this = this;
          var token = _this.id + (new Date()).getTime().toString() + Math.random().toString();
          _this.token = cryptojs.MD5(token).toString();
          this.update({token: _this.token});
      },
      authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
      },
      encryptPassword: function(password) {
        if (!this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password || '', salt, 10000, 64).toString('base64');
      }
    },
    getterMethods: {
        userInfo: function() {
            return {
                '_id': this._id,
                'name': this.name,
                'status': this.status
            }
        },
        password: function() {
            return this.hashedPassword;
        }
    },
    setterMethods: {
        password: function(password) {
            this.salt = crypto.randomBytes(16).toString('base64');
            this.hashedPassword = this.encryptPassword(password);
        }
    }
}

var modelName = 'user';
module.exports.register = function(db) {
    return {
        model: db.define(modelName, modelStructure, options),
        name: modelName,
        modelStructure: modelStructure
    }
}
