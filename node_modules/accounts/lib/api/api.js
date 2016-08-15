module.exports = function(db, app, options) {

  var accounts = require('./accounts')(db, app, options);

  //API
  return {
    accounts: accounts,
    accountById: function(id) {
      return accounts.byId(id);
    },
    accountByEmail: function(email) {
      return accounts.byEmail(email);
    },
    providerLogin: function(profile, accessData) {
      return accounts.providerLogin(profile, accessData);
    }
  };
}
