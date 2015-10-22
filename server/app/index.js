'use strict'; 

var app = require('express')();
var path = require('path');
var passport = require('passport');
var User = require('../api/users/user.model');

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
		successRedirect : '/',
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
			console.log('token - ' , token);
			User.findOne({'google.id': profile.id})
			.then(function(user) {
				if (user) {
					console.log('google id found - ' + user)
					return done(null, user);
				} else {
					var newUser = new User();
			        // set all of the google information in our user model
			        newUser.google.id = profile.id; // set the users google id                   
			        newUser.google.token = token; // we will save the token that google provides to the user                    
			        newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
			        newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
			        // don't forget to include the user's email, name, and photo
			        newUser.email = newUser.google.email; // required field
			        newUser.name = newUser.google.name; // nice to have
			        newUser.photo = profile.photos[0].value; // nice to have
			        // save our user to the database
			        User.create(newUser)
			        .then(function (data) {
			        	console.log('created new google user - ', data);
			        	return done(null, newUser);
			        })
			        .then(null, function (err) {
			        	return done(err);
			        })
				}
				
			})
			.then(null, function(err) {
				done(err);
			})
			//done();
		})
);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, done);
});

//ya29.FAJyHaT8_FPe1t7WHE54zWy-ndnCoOHX73WAgEawxe3JZCRKepvfRO5Vk0KeceAJOX1r
app.use(require('./error.middleware'));


module.exports = app;