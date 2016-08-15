module.exports.migrate = function(sequelize, version, method) {
  var migrator = sequelize.getMigrator({
    path: __dirname + '/migrations/' + version,
    filesFilter: /\.js$/
  });

  return migrator
    .migrate({
      method: method || 'up'
    })
    .success(function() {
      console.log('The migrations have been executed!');
    }).error(function(error) {
      console.error('Migration error', error);
    });
}
