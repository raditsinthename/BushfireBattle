var mongoose = require('mongoose');
var User = mongoose.model('User');

// GET user list:
module.exports.List = index;

function index(req,res){
	User
	 .find()
	  .exec(
	    function(err, users){
	     if(err){
             	res.render('error', {
		message:err.message,
		erroer: err
		});
	     }
	     else{
			console.log(users);
			console.log('find complete');
			res.render('users',{'users':users});
	     }
	    }
	);
};

// POST a new user
module.exports.newUser = function(req,res){
	console.log(req.body);
	if(!req.body.username || !req.body.email){
		res.status(500);
		res.render('error', {
		 message:"Error: Parameters missing",
		 error: {}
		});
	}
	else{
	var newUser = new User({username: req.body.username, email: req.body.email});
	console.log(newUser);
	newUser.save(function(err,data){
	 if(err){
	  console.log(err);
	  res.status(500);
	  res.render('error', {
	   message:err.message,
	   error: err
	  });
	 }
	 else{
	  console.log(data, ' saved');
	  index(req, res);
	 }
	});
	}
	};

// DELETE user
module.exports.deleteUser = function(req,res){
	if(!req.params.id ){
	 res.status(500);
	 res.render('error', {
	  message:"Error: Parameters missing",
	  error: {}
	});
	}
	else{
	User.remove({_id:req.params.id}, function(err){
	 if(err){
	  console.log(err);
	  res.status(500);
	  res.render('error', {
		message:err.message,
		error: err
	});
	}
	else{
	 console.log(req.params.id, ' removed');
	 res.redirect('/users'); 
	    }
	});
	}
}
