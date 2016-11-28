// var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

module.exports = function(passport) {
	// passport.serializeUser(function(user, done) {
 //  		done(null, user.id);
	// });

	// passport.deserializeUser(function(obj, done) {
 // 	 	done(null, obj);
	// });

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
        profileFields: ['id', 'emails', 'name'] //This

	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			// access the user info here
			// check if user exists, if not create user
			console.log(profile);
			// return done(null, 0);


			// find the user in the database based on their facebook id
            User.findOne({ 'fbid' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err){
                	                	console.log("0")

                    return done(err);
                }

                // if the user is found, then log them in
                if (user) {
                	console.log("1")
                    return done(null, user); // user found, return that user
                } else {
                	                	console.log("2")

                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.fbid    = profile.id; // set the users facebook id                   
                    newUser.token = token; // we will save the token that facebook provides to the user                    

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