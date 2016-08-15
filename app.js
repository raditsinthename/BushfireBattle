var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./app_server/models/db.js');
var passwordHash = require('password-hash');
var io = require('io');
var app = express();
var flash = require('express-flash');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var passMethods = require('./public/javascripts/passport.js');

//Setting up local login strategy
passport.use('local-login',new Strategy(
	{ passReqToCallback: true},
	function(req, username, password, done){
	User.findOne({username:username}, function(err, user) {
	 if (err)
		return done(err);
	 if (!user)
		return done(null, false, req.flash('loginMessage', 'No user found.'));

	 if (!user.validPassword(password))
		return done(null, false, req.flash('loginMessage', 'Incorrect password.'));	
	return done(null, user);
});
}));

//Setting up local register strategy
passport.use('local-signup', new Strategy(
	{ passReqToCallback: true},
	function(req, username, password, done) {
		process.nextTick(function(){
			User.findOne({ username:username}, function(err, user) {
				if (err)
					return done(err);
				if (user) {
					return done(null, false, req.flash('loginMessage', 'That username is already in use.'));
				} else {
						var newUser = new User({ username:username, password:passwordHash.generate(password)});
						// setting up achievements:
						newUser.achievements.push({
							name: 'Extinguish 100 fires',
							picture: '/images/achievements/locked.png'
						});
						newUser.achievements.push({
							name: 'Deploy 100 helicopters',
							picture: '/images/achievements/locked.png'
						});
						newUser.achievements.push({
							name: 'Win 50 games!',
							picture: '/images/achievements/locked.png'
						});
						newUser.achievements.push({
							name: 'Win a game without using any abilities',
							picture: '/images/achievements/locked.png'
						});
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));
//Passport authenticated session persistence
passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	User.findById(id, function (err, user) {
	 if (err) { return cb(err); }
	 cb(null,user);
	});
});
app.use(require('morgan')('combine'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'test', resave: false, saveUninitialized: false}));

//Initialize passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Setting up chat room

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
	if (req.user) {res.locals.user = req.user;}
	next();
});

var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
var login = require('./app_server/routes/login');
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Setting up session


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
