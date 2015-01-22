//http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
'use strict';

/**
 * Dependencies
 */
var localStrategy = require('passport-local').Strategy;
var studentModel = require('../../models/studentModel.js');
var landlordModel = require('../../models/landlordModel.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    passport.use('login', new localStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            studentModel.findOne({
                    'username': username
                },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false, req.flash('message', 'User Not found.'));
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        }));


    // var isValidPassword = function(user, password){
    //     return bCrypt.compareSync(password, user.password);
    // }

}
