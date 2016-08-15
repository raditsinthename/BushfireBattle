var Api = require('./api'),
  Db = require('../db'),
  validator = require('../validation'),
  assert = require('assert'),
  slug = require('slug'),
  crypto = require('crypto');

module.exports = function(connection, options) {
  var db = Db(connection, options);
  var apps = require('./apps')(db, options);

  return {
    sync: function(opts) {
      return db.sequelize.sync(opts);
    },

    drop: function(opts) {
      return db.sequelize.drop(opts);
    },

    apps: apps,

    repository: function(appKey, opts) {
      //console.log('calling api');
      return apps.byKey(appKey).then(function(app) {
        if (app)
          return Api(db, app, opts);
        throw new Error('App not found!');
      });
    },

    api: function(appKey, opts) {
      return this.repository(appKey, opts);
    },

    migrate: function(version, method) {
      return require('../migrator').migrate(db.sequelize, version, method);
    }
  };
}
