import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

export function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/user/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const googleId = profile.id;
          const name = profile.displayName || "User";

          // 1. Check if user exists with this googleId
          let user = await User.findOne({ googleId });
          if (user) return done(null, user);

          // 2. Check if user exists with same email (sync accounts)
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = googleId;
              if (!user.name || user.name === "User") user.name = name;
              await user.save();
              return done(null, user);
            }
          }

          // 3. Create new user (no password needed for Google users)
          user = await User.create({
            name,
            email,
            googleId,
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
