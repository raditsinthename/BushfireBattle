# node-accounts

**node-accounts** is a User Management module for Node.js.
Supports Sequelize dialects: MySQL, MariaDB, SQLite and PostgreSQL

**node-accounts** works fine with profile providers(Google, Yahoo, Facebook, etc.).

Current version supports logins only with providers.

## Usage

All you need to do is to create an application, and then to use appKey for accessing accounts.

#### Create a new app
```
var Accounts = require('accounts')(config.connection);
// `connection` if a Sequelize connection object (connectionString or object)
var appKey;

Accounts.apps.create({
    name: 'Test app'
  }).then(function(app) {
    appKey = app.key;
});
```

#### Provider login
```
var Accounts = require('accounts')(config.connection);
// `connection` if a Sequelize connection object (connectionString or object)
var appKey = 'ert457943346893695krjgerugui';
var repository;

Accounts.repository(appKey).then(function(result) {
  repository = result;
  login();
});

function login(){
  repository.providerLogin(profile, accessData).then(function(account){
    if(account)
      console.log(account);
    else
      console.log('login faild');
  });
}
```
Where `Profile` is a Passport [User Profile](http://passportjs.org/guide/profile/)
```
var profile = {
  provider: 'facebook',
  id: '123124234235123',
  displayName: 'Dumitru K'
};
```
and `accessData` is access data from the provider (can be JSON string):
```
var accessData = {
  accessToken:'dsgsgs', refreshToken:'gerge'
}
```

## Create/drop DB schema:
```
var Accounts = require('accounts')(config.connection);
//create db schema
Accounts.sync();
//drop db schema
Accounts.drop();
```

## API

API structure:
```
require('accounts')(config.connection): // init accounts with a connectionString
  sync() // create DB schema
  drop() // drop DB schema
  apps:
    create(appData) // create a new app
    drop(appKey) // delete app by appKey
    byKey(appKey) // find app by key
  repository/api(appKey): //create a repository/api for the appKey
    accounts:
      byId(id) // find account by id
      byEmail(email) // find account by email
      byKey(key) // find account by key
      providerLogin(profile, accessData) // provider login
    accountById(id) // similar to accounts.byId(id)
    providerLogin(id) // similar to accounts.providerLogin(id)
```
