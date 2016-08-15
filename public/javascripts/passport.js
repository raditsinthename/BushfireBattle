var mongoose = require('mongoose');
var db = mongoose.model('User');
module.exports.findById = function(id, cb) {
	process.nextTick(function() { 
	var idx = id - 1;
	 if (db[idx]) {
	  cb(null, db[idx]);
	 } else {
	  cb(new Error('User ' + id + ' does not exist'));
	 }
	});
}

module.exports.findByUsername = function(username, cb) {
	process.nextTick(function() { 
	 for (var i = 0, len = db.length; i < len; i++) {
	  var curUser = db[i];
	  if (db.username === username) {
		return cb(null, curUser);
	  }
	 }
	 return cb(null, null);
	});
}
