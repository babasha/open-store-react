require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      if (userResult.rows.length > 0) {
        done(null, userResult.rows[0]);
      } else {
        const newUserResult = await pool.query(
          'INSERT INTO users (first_name, last_name, email, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id]
        );
        done(null, newUserResult.rows[0]);
      }
    } catch (err) {
      console.error('Error authenticating with Google:', err.message);
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, userResult.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
