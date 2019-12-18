const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const config = require('../config');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('Bearer')]);
opts.secretOrKey = config.secret;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log('jwt_payload', jwt_payload)
    const userInfo = await User.findOne({
      user_id: jwt_payload.user_id
    })
    console.log(userInfo)
    if (userInfo) {
      done(null, userInfo);
    } else {
      done(null, false);
    }
  }));
}