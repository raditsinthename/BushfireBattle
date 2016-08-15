var express = require('express');
var router = express.Router();
var ctrlLogin = require("../controllers/login");
var passport = require('passport');
var app = express();

/* GET login page */
router.get('/', ctrlLogin.getLogin);

/* POST a login */
router.post('/', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login?m=1',
	failureFlash: true
}));


/* GET  logout */
router.get('/logout', ctrlLogin.getLogout);

/* GET profile */
router.get('/profile', isAuthenticated, ctrlLogin.getProfile);

function isAuthenticated(req, res, next) {
	if (typeof req.user !== "undefined")
	  app.set('view options',{'user': req.user});
	  return next();
	res.redirect('/login');
}

/* POST signup */
router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/login?m=2',
		failureFlash : true
}));

/* POST profile update */
router.post('/update', ctrlLogin.postUpdate);

module.exports = router;

