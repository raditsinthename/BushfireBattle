var validator = require('../validation'),
  assert = require('assert'),
  slug = require('slug'),
  crypto = require('crypto'),
  _ = require('lodash'),
  Sequelize = require('sequelize'),
  Promise = require('bluebird'),
  uuid = require('node-uuid');

function debug(message) {
  console.log(message);
}

var STATE_PROVIDER_LOGIN = 1,
  STATE_FIND_ACCOUNT = 2,
  STATE_CU_AC = 3,
  //STATE_FOUND_ACCOUNT = 4,
  STATE_U_GA_GP = 5,
  STATE_U_ACCOUNT = 6,
  STATE_FIND_ACCOUNT_GP = 7,
  STATE_FOUND_ACCOUNT_GP = 8,
  STATE_LINK_ACCOUNT_GA = 9,
  STATE_CREATE_ACCOUNT_GP = 10,
  STATE_CREATE_ACCOUNT_GA_GP = 11,
  STATE_FIND_GP = 12,
  STATE_FOUND_GP = 13,
  STATE_CREATE_ACCOUNT_FROM_GA = 14,
  STATE_CREATE_GP = 15,
  STATE_CREATE_GA_GP = 16;

module.exports = function(db, app, profile, accessData) {
  debug('start loginWithProvider');
  var globalProfile = buildGlobalProfile(profile);
  var accountConnection = buildAccountConnection(app, profile, accessData);
  return processState(db, app, STATE_PROVIDER_LOGIN, globalProfile, accountConnection);
}

function processState(db, app, state, globalProfile, accountConnection, account) {
  debug('processing state: ' + state);
  var filter, list, promise;
  switch (state) {

    case STATE_PROVIDER_LOGIN:
      return db.AccountConnection.findOne({
        where: {
          id: accountConnection.id
        }
      }).then(function(data) {
        if (data) {
          data.accessData = accountConnection.accessData;
          accountConnection = data;
          //return processState(db, app, STATE_CU_AC, globalProfile, accountConnection);
          return accountConnection.getAccount().then(function(data) {
            account = data;
            //debug('found accountConnection account');
            return processState(db, app, STATE_CU_AC, globalProfile, accountConnection, account);
          });
        }

        return processState(db, app, STATE_FIND_ACCOUNT, globalProfile, accountConnection);
      });

    case STATE_FIND_ACCOUNT:
      filter = isNullOrEmpty(globalProfile.email) ? {
        where: {
          globalAccountId: globalProfile.id,
          appId: app.id
        }
      } : {
        where: Sequelize.and({
          appId: app.id
        }, Sequelize.or({
          globalAccountId: globalProfile.id
        }, {
          email: globalProfile.email
        }))
      };

      return db.Account.findOne(filter).then(function(data) {
        if (data) {
          account = data;
          if (account.globalAccountId === globalProfile.id)
          //found by global account id
            return processState(db, app, STATE_U_GA_GP, globalProfile, accountConnection, account);
          else
            return processState(db, app, STATE_FIND_ACCOUNT_GP, globalProfile, accountConnection, account);
        }
        return processState(db, app, STATE_FIND_GP, globalProfile, accountConnection);
      });

    case STATE_U_GA_GP:
      // update GlobalAccount & GlobalProfile
      list = [];
      if (globalProfile.get)
        list.push(Promise.resolve(globalProfile));
      else
        list.push(db.GlobalProfile.findOne({
          where: {
            id: globalProfile.id
          }
        }));
      if (account.globalAccountId)
        list.push(account.getGlobalAccount())

      return Promise.map(list, function(data) {
        return data;
      }).then(function(data) {
        var gProfile = data[0],
          gAccount;
        if (data.length > 1)
          promise = Promise.resolve(data[1]);
        else promise = gProfile.getGlobalAccount();

        return promise.then(function(data) {
          gAccount = data;
          if (isNullOrEmpty(gAccount.familyName) && !isNullOrEmpty(gProfile.familyName || globalProfile.familyName))
            gAccount.familyName = gProfile.familyName || globalProfile.familyName;
          if (isNullOrEmpty(gAccount.givenName) && !isNullOrEmpty(gProfile.givenName || globalProfile.givenName))
            gAccount.givenName = gProfile.givenName || globalProfile.givenName;
          if (isNullOrEmpty(gAccount.middleName) && !isNullOrEmpty(gProfile.middleName || globalProfile.middleName))
            gAccount.middleName = gProfile.middleName || globalProfile.middleName;
          if (isNullOrEmpty(gAccount.email) && !isNullOrEmpty(gProfile.email || globalProfile.email))
            gAccount.email = gProfile.email || globalProfile.email;
          if (isNullOrEmpty(gAccount.gender) && !isNullOrEmpty(gProfile.gender || globalProfile.gender))
            gAccount.gender = gProfile.gender || globalProfile.gender;
          if (isNullOrEmpty(gAccount.photo) && !isNullOrEmpty(gProfile.photo || globalProfile.photo))
            gAccount.photo = gProfile.photo || globalProfile.photo;

          if (account.globalAccountId !== gAccount.id)
            account.globalAccountId = gAccount.id;

          if (isNullOrEmpty(account.familyName))
            account.familyName = gAccount.familyName;
          if (isNullOrEmpty(account.givenName))
            account.givenName = gAccount.givenName;
          if (isNullOrEmpty(account.middleName))
            account.middleName = gAccount.middleName;
          if (isNullOrEmpty(account.email))
            account.email = gAccount.email;
          if (isNullOrEmpty(account.gender))
            account.gender = gAccount.gender;
          if (isNullOrEmpty(account.photo))
            account.photo = gAccount.photo;

          if (gAccount.changed().length > 0) {
            console.log(gAccount.changed());
            gAccount.save();
          }
          if (account.changed().length > 0) {
            console.log(account.changed());
            //return account.save().then(get);
            account.save();
          } // else return account.get();
          return processState(db, app, STATE_CU_AC, globalProfile, accountConnection, account);
        });
      });

    case STATE_CU_AC:
      // create/update AccountConnection
      if (accountConnection.save) {
        // return accountConnection.save().then(function() {
        //   return account.get();
        // });
        accountConnection.save();
        return account.get();
      }

      return db.AccountConnection.findOne({
        where: {
          id: accountConnection.id
        }
      }).then(function(data) {
        if (data) {
          data.accessData = accountConnection.accessData;
          return data.save().then(function() {
            return account.get();
          });
        }
        accountConnection.accountId = account.id;

        return db.AccountConnection.create(accountConnection).then(function() {
          return account.get();
        })
      });

    case STATE_FIND_ACCOUNT_GP:
      // finds GlobalProfile by account
      filter = isNullOrEmpty(account.email) ? {
        where: {
          id: globalProfile.id
        }
      } : {
        where: Sequelize.or({
          id: globalProfile.id
        }, {
          email: account.email
        })
      };

      return db.GlobalProfile.findOne(filter).then(function(data) {
        if (data) {
          globalProfile.globalAccountId = data.globalAccountId;
          if (data.id === globalProfile.id)
          // found by id
            return processState(db, app, STATE_LINK_ACCOUNT_GA, globalProfile, accountConnection, account);
          else {
            return db.GlobalProfile.findOne({
              where: {
                id: globalProfile.id
              }
            }).then(function(data2) {
              if (data2) {
                globalProfile = data2;
                return processState(db, app, STATE_LINK_ACCOUNT_GA, globalProfile, accountConnection, account);
              }
              return db.GlobalProfile.create(globalProfile).then(function(data) {
                globalProfile = data;
                return processState(db, app, STATE_LINK_ACCOUNT_GA, globalProfile, accountConnection, account);
              });
            });
          }
        }
        return processState(db, app, STATE_CREATE_ACCOUNT_GA_GP, globalProfile, accountConnection, account);
      });

    case STATE_LINK_ACCOUNT_GA:
      if (isNullOrEmpty(account.globalAccountId) && !isNullOrEmpty(globalAccount.globalAccountId))
        account.globalAccountId = globalProfile.globalAccountId;
      else if (account.globalAccountId !== globalProfile.globalAccountId) {
        debug(account.globalAccountId + '!==' + globalProfile.globalAccountId);
        throw new Error('Cannot change account\'s GlobalAccount');
      }
      return processState(db, app, STATE_U_GA_GP, globalProfile, accountConnection, account);

    case STATE_CREATE_ACCOUNT_GA_GP:
      // creates GlobalAccount and GlobalProfile for known account
      var gAccount = buildGlobalAccount(globalProfile);
      return db.GlobalAccount.create(gAccount).then(function(data) {
        globalProfile.globalAccountId = data.id;
        return db.GlobalProfile.create(globalProfile).then(function(data) {
          globalProfile = data;
          return processState(db, app, STATE_LINK_ACCOUNT_GA, globalProfile, accountConnection, account);
        });
      });

    case STATE_FIND_GP:
      // find GobalProfile without account
      filter = isNullOrEmpty(globalProfile.email) ? {
        where: {
          id: globalProfile.id
        }
      } : {
        where: Sequelize.or({
          id: globalProfile.id
        }, {
          email: globalProfile.email
        })
      };

      return db.GlobalProfile.findOne(filter).then(function(data) {
        if (data) {
          globalProfile.globalAccountId = data.globalAccountId;
          if (data.id === globalProfile.id) {
            // found by id
            return processState(db, app, STATE_CREATE_ACCOUNT_FROM_GA, globalProfile, accountConnection);
          } else {
            //found by email

            return db.GlobalProfile.create(globalProfile).then(function(data) {
              globalProfile = data;
              return processState(db, app, STATE_CREATE_ACCOUNT_FROM_GA, globalProfile, accountConnection);
            });
          }
        }
        return processState(db, app, STATE_CREATE_GA_GP, globalProfile, accountConnection);
      });

    case STATE_CREATE_ACCOUNT_FROM_GA:
      return db.GlobalAccount.findOne({
        where: {
          id: globalProfile.globalAccountId
        }
      }).then(function(globalAccount) {
        account = {
          globalAccountId: globalAccount.id,
          appId: app.id,
          email: globalProfile.email || globalAccount.email || void(0),
          username: globalAccount.username || globalProfile.username,
          displayName: globalAccount.displayName,
          familyName: globalAccount.familyName,
          givenName: globalAccount.givenName,
          middleName: globalAccount.middleName,
          gender: globalAccount.gender || globalProfile.gender || void(0),
          photo: globalAccount.photo || globalProfile.photo || void(0)
        };
        if (account.email) account.email = account.email.trim().toLowerCase();

        account.username = account.username || account.displayName.replace(/ /gi, '');
        account.username = slug(account.username).toLowerCase();
        if (account.username.length < 5) account.username += getRandomInt();
        return getUniqueAccountUsername(db, app, account.username, '').then(function(username) {
          account.username = username;
          account.key = uuid.v4();
          return db.Account.create(account).then(function(account) {
            return processState(db, app, STATE_CU_AC, globalProfile, accountConnection, account);
          });
        });
      });

    case STATE_CREATE_GA_GP:
      var gAccount = buildGlobalAccount(globalProfile);
      return db.GlobalAccount.create(gAccount).then(function(data) {
        gAccount = data;
        globalProfile.globalAccountId = gAccount.id;

        return db.GlobalProfile.create(globalProfile).then(function(data) {
          globalProfile = data;
          return processState(db, app, STATE_CREATE_ACCOUNT_FROM_GA, globalProfile, accountConnection);
        });
      });

    default:
      throw new Error('Unknown state: ' + state);
  }
}

function isNullOrEmpty(target) {
  return [undefined, null, ''].indexOf(target) >= 0;
}

function getUniqueAccountUsername(db, app, username, suffix) {
  var nname = username + suffix;
  console.log('finding username: ' + nname);
  return db.Account.findOne({
    where: {
      username: nname,
      appId: app.id
    }
  }).then(function(acc) {
    var acc = get(acc);
    if (acc) {
      debug('found account: ');
      //debug(acc.get());
      return getUniqueAccountUsername(db, app, username, String(getRandomInt()));
    }
    return nname;
  });
}

function buildGlobalProfile(profile) {
  var gp = {
    provider: profile.provider.trim().toLowerCase(),
    providerProfileId: profile.id.trim(),
    displayName: profile.displayName.trim(),
    username: profile.username,
    profileUrl: profile.profileUrl
  };

  gp.id = formatGlobalProfileId(gp.provider, gp.providerProfileId);

  if (profile.gender) gp.gender = profile.gender;

  if (profile.name) {
    gp.familyName = profile.name.familyName;
    gp.givenName = profile.name.givenName;
    gp.middleName = profile.name.middleName;
  }
  if (profile.emails && profile.emails.length > 0) {
    gp.email = profile.emails[0].value.trim().toLowerCase();
  }
  if (profile.photos && profile.photos.length > 0) {
    gp.photo = profile.photos[0].value.trim();
  }

  return gp;
}

function buildGlobalAccount(globalProfile) {
  var account = _.clone(globalProfile);

  return account;
}

function buildAccountConnection(app, profile, accessData) {
  var ac = {
    id: formatAccountConnectionId(app.id, profile),
    provider: profile.provider.trim().toLowerCase(),
    providerProfileId: profile.id,
    accessData: accessData,
    appId: app.id
  };

  return ac;
}

function formatAccountConnectionId(appId, profile) {
  profile.provider = profile.provider.trim().toLowerCase();
  profile.id = profile.id.trim();
  var key = appId + ':' + profile.provider + ':' + profile.id;

  return crypto.createHash('sha1').update(key).digest('hex');
}

function formatGlobalProfileId(provider, id) {
  return crypto.createHash('sha1').update(provider + ':' + id).digest('hex');
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = min || 10;
  max = max || 999999;
  return Math.floor(Math.random() * (max - min)) + min;
}

function get(data) {
  if (data && data.get)
    return data.get();
  return null;
}
