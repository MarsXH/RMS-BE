const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')

const config = require('../config')
const opts = {
  // Prepare the extractor from the header.
  jwtFromRequest: ExtractJwt.fromExtractors([
    req => req.cookies['authorization'],
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  ]),
  // Use the secret passed in which is loaded from the environment. This can be
  // a certificate (loaded) or a HMAC key.
  secretOrKey: config.JWT_SECRET,
  // Verify the issuer.
  issuer: config.JWT_ISSUER,
  // Verify the audience.
  audience: config.JWT_AUDIENCE,
  // Enable only the HS256 algorithm.
  algorithms: [config.JWT_ALG],
  // Pass the request object back to the callback so we can attach the JWT to it.
  passReqToCallback: true
}
// JwtStrategy.JwtVerifier = (token, secretOrKey, options, callback) => {
//   return jwt.verify(token, options, (err, jwt) => {
//     if (err) {
//       return callback(err)
//     }

//     // Attach the original token onto the payload.
//     return callback(false, { token, jwt })
//   })
// }

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async function (req, jwt_payload, done) {
    try {
      const userInfo = await User.findOne({
        user_uuid: jwt_payload.user_uuid
      })
      if (userInfo && userInfo.user_role > 0) {
        done(null, userInfo)
      } else {
        done(null, false)
      }
    } catch (e) {
      return done(e)
    }
  }))
}