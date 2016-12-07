// var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use(new FacebookStrategy({
		clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields		: ['id', 'emails', 'name'],
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			// access the user info here
			// check if user exists, if not create user
			// find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
										newUser.facebook.firstName = profile.name.givenName;
										newUser.facebook.lastName = profile.name.familyName;
										newUser.facebook.email = profile.emails[0].value;
                    newUser.facebook.id  = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
		})
	}
	));
};
