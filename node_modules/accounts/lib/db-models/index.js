module.exports = function(sequelize) {
  //  import:
  var m = {
    // documents
    GlobalProfile: sequelize["import"](__dirname + '/globalProfile'),
    GlobalAccount: sequelize["import"](__dirname + '/globalAccount'),
    App: sequelize["import"](__dirname + '/app'),
    Account: sequelize["import"](__dirname + '/account'),
    AccountConnection: sequelize["import"](__dirname + '/accountConnection')
  };

  //  relations:

  //  GlobalAccount->GlobalProfile
  m.GlobalAccount.hasMany(m.GlobalProfile, {
    foreignKey: {
      fieldName: 'globalAccountId',
      allowNull: false
    }
  });
  m.GlobalProfile.belongsTo(m.GlobalAccount, {
    foreignKey: 'globalAccountId'
  });

  //  App->Account
  m.App.hasMany(m.Account, {
    foreignKey: {
      fieldName: 'appId',
      allowNull: false
    }
  });
  m.Account.belongsTo(m.App, {
    foreignKey: 'appId'
  });

  //  Account->AccountConnection
  m.Account.hasMany(m.AccountConnection, {
    foreignKey: {
      fieldName: 'accountId',
      allowNull: false
    }
  });
  m.AccountConnection.belongsTo(m.Account, {
    foreignKey: 'accountId'
  });

  //  GlobalAccount->Account
  m.GlobalAccount.hasMany(m.Account, {
    foreignKey: {
      fieldName: 'globalAccountId',
      allowNull: true
    }
  });
  m.Account.belongsTo(m.GlobalAccount, {
    foreignKey: 'globalAccountId'
  });

  return m;
};
