var express = require('express'),
    http = require('http');

var config = __config;

// Setup Express
var app = express();
require(__base + 'api/config/express')(app);

module.exports.start = function() {
  var server = http.createServer(app);
  server.listen(config.port, config.ip, function () {
    console.log('HTTP server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
  });
}
