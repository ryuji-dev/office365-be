import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const JWT = process.env.JWT_SECRET;

if (!JWT) {
  throw new Error('JWT_SECRET must be defined');
}

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    req => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies.token;
      }

      return token;
    },
  ]),
  secretOrKey: JWT,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload: any, done: any) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);
