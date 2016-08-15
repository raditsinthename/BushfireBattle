var Sequelize = require('sequelize');
var _ = require('lodash');

module.exports = function(connection) {
  //console.log('creating db...');
  var sequelize = new Sequelize(connection);
  var models = require('./db-models')(sequelize);

  return _.assign({
    sequelize: sequelize
  }, models);
}
