// Fix bigint return as string issue
require('pg').defaults.parseInt8 = true;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(__config.postgres.uri, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: !!__config.postgres.ssl
    }
});
var fs = require('fs');
var path = require('path');
var models = {};
var relations = {};

// Go through each model file and load it.
var modelsPath = __base + 'server/sql_models';
var modelsFiles = fs.readdirSync(modelsPath)
for (var i in modelsFiles) {
    var file = modelsFiles[i];
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        var model = require(modelsPath + '/' + file).register(sequelize);
        models[model.name] = model;
        console.log('SQL Model found: ' + file);
    }
};

//var User = models['user'].model;

module.exports.connect = function(callback) {
    console.log('DROP DB', __config.postgres.forceDrop);
    sequelize.sync({force: __config.postgres.forceDrop}).then(function() {
        callback(null, sequelize);
    }).catch(function(error) {
        callback(error);
    })
}

module.exports.model = function(name) {
    if (!models[name]) return null;
    return models[name].model;
}

module.exports.relation = function(name) {
    if (!relations[name]) return null;
    return relations[name];
}

module.exports.sequelize = sequelize;
