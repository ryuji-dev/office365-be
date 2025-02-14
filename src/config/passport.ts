import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

dotenv.config();

const handleUser = async (
  profile: any,
  registerType: string,
  done: (err: any, user: any) => void
) => {
  try {
    const existingUser = await User.findOne({
      where: { socialId: profile.id, registerType },
    });

    if (existingUser) {
      done(null, existingUser);
    } else {
      const email = profile?.emails[0]?.value;

      if (!email) {
        return done(new Error('이메일이 존재하지 않습니다.'), null);
      }

      const newUser = await User.create({
        email,
        socialId: profile.id,
        registerType,
        profileImage: profile.photos[0].value,
      });

      done(null, newUser);
    }
  } catch (error) {
    console.error(error);
    done(error, null);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/v1/google/callback',
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user: any) => void
    ) => handleUser(profile, 'google', done)
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(
  (id: string, done: (error: any, user?: any) => void) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  }
);
