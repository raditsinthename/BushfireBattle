var mongoose = require('mongoose');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var passport = require('passport');


module.exports.getLogin = function(req, res){
		var m = req.param('m');
		if (typeof m !== 'undefined'){
			if (m == '1') {
				m = "Incorrect username or password";
			}
			else{
				m = "Signup failed - Username already exists.";
			}
			res.render('login', {Title:'Login', 'message':m});
		}
		res.render('login', {Title:'Login'});
};

module.exports.postLogin = function(req, res){	
	passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' })};

module.exports.getLogout = function(req, res){
	req.logout();
	res.redirect('/');
};

module.exports.getProfile = function(req, res){
	var req_username = req.param('u');
	User.findOne({'username': req_username}, function (err, user) {
		if (err) {res.redirect('/');} 
		else {
			Comment
				 .find({'user': user.username})
				  .exec(
					function(err, comments){
					 if(err){
						res.render('profile', {title:'Profile', 'disp_user': user, 'user':req.user });
					 }
					 else{
						console.log(comments);
						console.log('find complete');
						res.render('profile',{title:'Profile','comments':comments,'disp_user':user, 'user':req.user});
					 }
					}
				)
		}
	});
};

module.exports.postUpdate = function(req, res) {
	var color = req.param('color');
	var image = req.param('image');
	console.log(color);
	console.log(image);
	User.findById(req.user.id, function (err, user){
			if (err) return handleError(err);
			
			if (typeof color !== 'undefined'){
				user.color = color;
			}
			
			if (typeof image !== 'undefined'){
				user.avatarURL = image;
			}
			
			user.save(function (err) {
				if (err) 
					throw err;
				res.send(user);
			});
	})
};
