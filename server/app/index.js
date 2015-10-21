'use strict'; 

var app = require('express')();
var path = require('path');
var passport = require('passport');

// SESSIONS
var session = require('express-session');
app.use(session({
	// this mandatory configuration ensures that session IDs are not predictable
	secret: 'tongiscool'
}));


app.use(function (req, res, next) {
	next();
});
////

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});


// GOOOGLE //
//google authentication and login
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after google has authenticated the user
app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/home',
		failureRedirect : '/'
	}));
//// end of google

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
	new GoogleStrategy({
			clientID: '813141840703-qrc4nn77ahp74bvcv95se6uh9va1s6n3.apps.googleusercontent.com',
			clientSecret: 'IzoAwjjFR6TnD1aD1DDXye_p',
			callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
		},
		// google will send back the token and profile
		function (token, refreshToken, profile, done) {
			//the callback will pass back user profilie information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
			/*
			 --- fill this part in ---
			 */
			console.log("WE ARE HERE in VERIFICATION", profile);
			done();
		})
);


app.use(require('./error.middleware'));


module.exports = app;