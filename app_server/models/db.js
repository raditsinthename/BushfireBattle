var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through ' + msg);
			callback();
				});
};

var msgSchema = new mongoose.Schema(
	{user: String,
	 message: String,
	 color: {type:String, default:'black'},
	 time: Date
	});
	
mongoose.model('Message',msgSchema, 'messages');

require('./user_model.js');