const LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secter;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  //Local Strrategy
  // passport.use(new LocalStrategy(function(username, password, done){
  //   //Match username
  //   let query = {username:username}
  //   User.findOne(query, function(err, user){
  //     if(err) throw err;
  //     if (!user) {
  //       return done(null, false, {message: 'No User Found'});
  //     }

  //   //match password
  //   bcrypt.compare(password, user.password, function(err, isMatch){
  //     if(err) throw err;
  //     if (isMatch) {
  //       return done(null, user);
  //     } else {
  //       return done(null, false, {message: 'Wrong password'});
  //     }
  //   });
  //   });
  // }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

}
