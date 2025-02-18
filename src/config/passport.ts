import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import User from '../models/User';

dotenv.config();

const handleUser = async (
  profile: any,
  registerType: string,
  done: (err: any, user?: any) => void
) => {
  try {
    const existingUser = await User.findOne({
      socialId: profile.id,
      registerType,
    });

    if (existingUser) {
      done(null, existingUser);
    } else {
      const email = profile?.emails
        ? profile.emails[0].value
        : registerType === 'kakao'
        ? profile?._json?.kakao_account?.email
        : registerType === 'naver'
        ? profile.email
        : null;

      const profileImg = profile.photos
        ? profile.photos[0].value
        : registerType === 'kakao'
        ? profile?._json?.properties?.thumbnail_image
        : registerType === 'naver'
        ? profile.profile_image
        : null;

      if (!email) {
        return done(new Error('Email not found'), null);
      }

      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        return done(null, userByEmail);
      }

      const newUser = await User.create({
        email,
        socialId: profile.id,
        registerType,
        profileImage: profileImg,
      });
      done(null, newUser);
    }
  } catch (err) {
    console.error(err);
    done(err);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user: any) => void
    ) => handleUser(profile, 'google', done)
  )
);

// Naver Strategy
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      callbackURL: process.env.NAVER_CALLBACK_URL!,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user: any) => void
    ) => handleUser(profile, 'naver', done)
  )
);

// Kakao Strategy
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID!,
      callbackURL: process.env.KAKAO_CALLBACK_URL!,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user: any) => void
    ) => handleUser(profile, 'kakao', done)
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
