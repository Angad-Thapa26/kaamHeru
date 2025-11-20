const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with Google ID
        let existingUser = await User.findOne({
          'oauthProviders.google.id': profile.id,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with the same email
        existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // Link Google account to existing user
          existingUser.oauthProviders = {
            google: {
              id: profile.id,
              email: profile.emails[0].value,
            },
          };
          existingUser.isOAuthUser = true;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create new user from Google profile
        const newUser = new User({
          username: profile.emails[0].value.split('@')[0] + '_' + Date.now(),
          email: profile.emails[0].value,
          fullName: profile.displayName,
          profileImage: profile.photos[0].value,
          role: 'public', // Default role for OAuth users
          municipality: 'Bharatpur', // Default municipality, should be updated by user
          oauthProviders: {
            google: {
              id: profile.id,
              email: profile.emails[0].value,
            },
          },
          isOAuthUser: true,
          isActive: true,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
