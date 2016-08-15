
// var ctrlChat = require('./app_server/controllers/chat');
// var io = require('socket.io')();
// io.on('connection', function(socket){
	// ctrlChat.connect(io,socket);
	// socket.on('disconnect', ctrlChat.disconnect);
	// socket.on('message', function(msg){ctrlChat.message(msg,io);});
// });

//module.exports = io;


// var ctrlChat = require('./app_server/controllers/chat');

// var express = require('express');
// var app = express();
// var expressSession = require("express-session");
// var sessionMiddleware = expressSession({
	// secret: 'secret',
	// store: new (require("connect-mongo")(expressSession))({
		// url: "mongodb://localhost/test"
	// })
// });

// app.use(sessionMiddleware);

// var io = require('socket.io')();
	// io.use(function(socket,next){
		// sessionMiddleware(socket.request, {}, next);
		// })
		// .on("connection", function(socket){
			// ctrlChat.connect(io,socket);
			// if (socket.request.session.passport){
			// var userId = socket.request.session.passport.user;
			// console.log("Your User ID is ", userId);
			// }
			// else {
				// console.log("Your User ID is Guest"); 
			// }
			 // socket.on('disconnect', ctrlChat.disconnect);
			 // socket.on('message', function(msg){ctrlChat.message(msg,io);});
		// });
		
		
		
		
// module.exports = io;

var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var ctrlChat = require('./app_server/controllers/chat');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var app = express();
var server = Server(express);
var sio = require("socket.io")(server);

var sessionMiddleware = session({
	secret: "secret",
	store: new MongoStore({mongooseConnection: mongoose.connection})
	});
		
sio.use(function(socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
	});
	
app.use(sessionMiddleware);

sio.sockets.on("connection", function(socket) {
	ctrlChat.connect(sio,socket); 
	socket.on('disconnect', ctrlChat.disconnect);
	socket.on('message', function(msg){ctrlChat.message(msg,sio,socket)});
});

module.exports = sio;	