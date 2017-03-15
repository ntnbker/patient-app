var _ = require('lodash');
var controllerPath = __base + 'server/controllers/';

var userCtrl = require(controllerPath + 'users');
var middleware = require(controllerPath + 'middleware');
var patientCtrl = require(controllerPath + 'patient');
var sessionCtrl = require(controllerPath + 'session');

var passport = require('passport');


var routes = [
  {
    path: '/auth/local',
    method: 'POST',
    middlewares: [function(req, res, next) {
      req.auth = {
        strategy: 'local'
      };
      next();
    }, sessionCtrl.login],
    noAuth: true
  },
  {
    path: '/auth/local',
    method: 'DELETE',
    middlewares: [sessionCtrl.logout],
  },
  {
    path: '/v1/userinfo',
    method: 'GET',
    middlewares: [userCtrl.me, patientCtrl.createPatient],
    //noAuth: true
  },
  {
    path: '/signup',
    method: 'POST',
    middlewares: [userCtrl.createLocalUser],
    noAuth: true
  },
  {
    path: '/v1/patients',
    method: 'GET',
    middlewares: [patientCtrl.getPatients],
    noAuth: true
  },
  {
    path: '/v1/patient/:id',
    method: 'PUT',
    middlewares: [patientCtrl.checkPermission, patientCtrl.updatePatient]
  },
  {
    path: '/v1/patient/:id',
    method: 'GET',
    middlewares: [patientCtrl.getPatient],
    noAuth: true
  },
  {
    path: '/auth/local',
    method: 'PUT',
    middlewares: [userCtrl.changePassword, sessionCtrl.logout]
  }
]

module.exports = function(app) {
  for (var i in routes) {
    if (!routes[i].noAuth) routes[i].middlewares.unshift(middleware.userAuth);
  }
  for (var i in routes) {
    applyRoute(app, routes[i]);
  }
}

function applyRoute(app, route) {
  console.log('APPLY ROUTE', route);
  var args = _.flatten([route.path, route.middlewares]);
  switch (route.method.toUpperCase()) {
      case 'GET':
          app.get.apply(app, args);
          break;
      case 'POST':
          app.post.apply(app, args);
          break;
      case 'PUT':
          app.put.apply(app, args);
          break;
      case 'DELETE':
          app.delete.apply(app, args);
          break;
      default:
          throw new Error('Invalid HTTP method specified for route ' + route.path);
          break;
  }
}
