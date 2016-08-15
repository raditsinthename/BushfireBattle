require('../models/db');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports.connect = function(socket){
	console.log('User Connected');
	Message.find().sort({time:-1}).limit(30).exec(
		function(err, messages){
			if(err){
				res.render('error',{
					message:err.message,
					error:err
					});
			}
			else{
				console.log('last 30 messages');
					for(var i = messages.length-1; i>=0; i--){
						var user = messages[i].user;
						var msg = messages[i].message;
						var color = messages[i].color;
						socket.emit('message',{user:user,msg:msg,color:color});
					}
				}
		});
}

module.exports.disconnect = function(){
					console.log('User Disconnected');
}

module.exports.message = function(data, io){
	console.log('message received!');
	console.log("user: "+data.user+", message: "+data.msg+", color: "+data.color);
	var message = new Message({user:data.user, message:data.msg,color:data.color, time: new Date()});
	
	message.save(function(err,data){
		if(err){
			console.log(err);
			res.status(500);
			res.render('error',{
				message:err.message,
				error: err
			});
		}
		else{
			console.log(data, 'message saved');
		}
	});
	io.emit('message', { user:data.user, msg:data.msg, color:data.color});
}