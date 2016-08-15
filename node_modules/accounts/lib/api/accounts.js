var validator = require('../validation'),
  assert = require('assert'),
  slug = require('slug'),
  crypto = require('crypto'),
  providerLogin = require('./providerLogin'),
  _ = require('lodash'),
  uuid = require('node-uuid');


module.exports = function(db, app, options) {

  //accounts API
  return {
    // get account by id
    byId: function(id) {
      return db.Account.findOne({
        where: {
          id: id,
          appId: app.id
        }
      }).then(get);
    },
    // get account by email
    byEmail: function(email) {
      return db.Account.findOne({
        where: {
          email: email,
          appId: app.id
        }
      }).then(get);
    },
    // get account by globalId
    byGlobalId: function(id) {
      return db.Account.findOne({
        where: {
          globalAccountId: id,
          appId: app.id
        }
      }).then(get);
    },
    // get account by key
    byKey: function(key) {
      return db.Account.findOne({
        where: {
          key: key,
          appId: app.id
        }
      }).then(get);
    },

    providerLogin: function(profile, accessData) {
      assert.ok(profile);
      assert.ok(accessData);
      if (!_.isString(accessData) && _.isPlainObject(accessData))
        accessData = JSON.stringify(accessData);
      else throw new Errro('invalid accessData');

      validator.assert('accounts/profile', profile);

      return providerLogin(db, app, profile, accessData);
    },

    regenerateKey: function(id) {
      return db.Account.findOne({
        where: {
          id: id,
          appId: app.id
        }
      }).then(function(account) {
        account.set('key', uuid.v4());
        return account.save().then(function() {
          return account.get('key');
        });
      });
    }
  };
}


function get(data) {
  if (data && data.get)
    return data.get();
  return null;
}
