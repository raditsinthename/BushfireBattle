var mongoose = require('mongoose');
var User = mongoose.model('User');
var comment =  mongoose.model('Comment');

// get home page:
module.exports.index = function(req,res) {
	  res.render('index', { title: 'Bushfire Battle', 'user': req.user  });
};

// get comments page:
module.exports.comments = function(req,res) {
	comment
	 .find()
	  .exec(
	    function(err, comments){
	     if(err){
             	res.render('comments',{title: 'Comments', 'user':req.user});
		}
	     else{
			console.log(comments);
			console.log('find complete');
			res.render('comments',{title:"Comments", 'comments':comments,'user':req.user});
			}
		}
	)
}

// get rules page:
module.exports.rules = function(req,res) {
	  res.render('rules', { title: 'Rules', 'user': req.user });
};

// get game page:
module.exports.game = function(req,res) {
	  if (req.user) {
		 User.
			find().
			sort({fires: -1}).
			select({ username: 1, fires: 1}).
			exec(
				function(err,leaders){
					if(err){}
					else{
						res.render('game',{title: 'Play Bushfire Battle', 'user':req.user, 'leaders':leaders});
					}
				})
	  } else {
		res.redirect('/login');
	  }
};

module.exports.gameID = function(req,res) {
		res.render('game', { title: 'Play Bushfire Battle', 'user': req.user});
	};

// posting a comment:
module.exports.post = function(req, res) {
	var userName = req.user.username;
	var thisComment = req.body.description;
	
	
	var newComment = new comment({user:userName, message:thisComment});
	
	newComment.save(function(err) {
		if (err)
			throw err;
		res.redirect("/comments/");
	})
}




	
// updating user data after a game is completed:	
module.exports.update = function(req, res) {
		
			
					

		var uWins = + req.user.wins + +req.param('w');
		var uLosses = + req.user.losses + +req.param('l');
		var uFires = + req.user.fires + +req.param('f');
		var uHelis = + req.user.helis + + req.param('h');
		var abilities = req.param('a');
		User.findById(req.user.id, function (err, user){
			if (err) return handleError(err);
			
			console.log(uHelis);
			user.wins = uWins;
			user.losses = uLosses;
			user.fires = uFires;
			user.helis = uHelis;
			
			// checking if achievements are completed:
			if (uFires > 99) {
				user.achievements[0].completed = true;
				user.achievements[0].picture = '/images/achievements/fires.png';
			}

			if (uHelis > 99) {
				user.achievements[1].completed = true;
				user.achievements[1].picture = '/images/achievements/helis.png';
			}
			
			if (uWins > 50) {
				user.achievements[2].completed = true;
				user.achievements[2].picture = '/images/achievements/wins.png';
			}
			
			if (abilities === 'false') {
				user.achievements[3].completed = true;
				user.achievements[3].picture = '/images/achievements/abilities.png';
			}
			
			user.save(function (err) {
				if (err) 
					throw err;
				res.send(user);
			});
		});
};

// get theme page:
module.exports.theme = function(req,res) {
	  res.render('theme', { title: 'The Theme of BushFire Battle', 'user': req.user  });
};

// get contact page:
module.exports.contact = function(req,res) {
	  res.render('contact', { title: 'Contact Details', 'user': req.user  });
};

// get architecture page:
module.exports.architecture = function(req,res) {
	  res.render('Architecture', { title: 'architecture', 'user': req.user  });
};


var mongoose = require('mongoose');
var User = mongoose.model('User');


