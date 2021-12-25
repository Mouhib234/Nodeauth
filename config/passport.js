const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const confi = require("../config/database");
const User = require("../models/user");

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = confi.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("User");
      console.log(jwt_payload);
      User.findOne({ _id: jwt_payload._doc._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
