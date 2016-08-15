var validator = require('../validation'),
  assert = require('assert'),
  slug = require('slug'),
  crypto = require('crypto');

function get(data) {
  if (data && data.get)
    return data.get();
  return null;
}

module.exports = function(db, options) {

  //apps API
  return {
    // get app by key
    byKey: function(key) {
      return db.App.findOne({
        where: {
          key: key
        }
      }).then(get);
    },
    // get app by key
    byUname: function(uname) {
      return db.App.findOne({
        where: {
          uname: uname
        }
      }).then(get);
    },

    create: function(data) {
      assert.ok(data);

      validator.assert('apps/create', data);

      data.uname = slug(data.uname || data.name).replace(/\./, '-').toLowerCase();
      var time = (new Date()).getTime().toString();
      //console.log('time: ' + time);
      data.key = crypto.createHash('md5').update(time).digest('hex');

      return db.App.create(data).then(function(app) {
        return app.get();
      });
    },

    drop: function(key) {
      return db.App.destroy({
        key: key
      });
    }
  };
}
