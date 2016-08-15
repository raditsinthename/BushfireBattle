module.exports = {
  up: function(migration, DataTypes, done) {
    addKeyCollumn(migration, DataTypes).success(function() {
      return addEmailIndex(migration, DataTypes).success(function() {
        return addKeyIndex(migration, DataTypes).success(done);
      });
    }).error(done);
  }
};


function addKeyCollumn(migration, DataTypes) {
  return migration.addColumn(
    'Accounts',
    'key', {
      type: DataTypes.STRING(32),
      //allowNull: false,
      //defaultValue: DataTypes.UUIDV4
    }
  );
}

function addEmailIndex(migration, DataTypes) {
  return migration.addIndex(
    'Accounts', ['appId', 'email'], {
      indexName: 'accounts_appid_email',
      indicesType: 'UNIQUE'
    }
  );
}

function addKeyIndex(migration, DataTypes) {
  return migration.addIndex(
    'Accounts', ['appId', 'key'], {
      indexName: 'accounts_appid_key',
      indicesType: 'UNIQUE'
    }
  );
}
