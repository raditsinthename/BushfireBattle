var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var achievementSchema = new mongoose.Schema(
	{name:{type:String, required:true},
	 completed:{type: Boolean,required: true, 'default': false},
	 picture:{type:String, required:true, 'default':'/images/achievements/locked.png'}
});

var userSchema = new mongoose.Schema(
	{username:{type:String, required:true},
	 password:{type:String, required:true, 'default':'password'},
	 achievements:{type:[achievementSchema],required:false},
	 avatarURL: {type: String, required:true, 'default':'/images/avatars/fire.png'},
	 fires:{type: Number, required: true, 'default':0},
	 wins:{type: Number, required: true, 'default':0},
	 losses:{type: Number, required: true, 'default':0},
	 helis:{type: Number, required: true, 'default':0},
	 color:{type: String, required: true, 'default': 'black'}
});

var commentsSchema = new mongoose.Schema(
	{message:{type:String, required:true},
	user:{type: String, required: true},
	time:{type: Date, 'default': Date.now}
});
	 

userSchema.methods.validPassword = function(pwd) {
	return (passwordHash.verify(pwd, this.password))
};

mongoose.model('Comment', commentsSchema, 'comments');
mongoose.model('User', userSchema, 'users');
mongoose.model('Achievement', achievementSchema, 'achievements');
