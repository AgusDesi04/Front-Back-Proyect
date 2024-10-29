import 'dotenv/config';
import passport from "passport";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import * as services from "../services/userServices.js";

const SECRET_KEY = process.env.SECRET_KEY

const verifyToken = (jwt_payload, done) => {
  if (!jwt_payload) return done(null, false, { messages: 'User Not Found!' });
  return done(null, jwt_payload);
};

const cookieExtractor = (req) => {
  const token = req.cookies ? req.cookies.token : null;
  return token;
};

const strategyConfigCookies = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: SECRET_KEY
};

passport.use('current', new jwtStrategy(strategyConfigCookies, verifyToken));

passport.serializeUser((user, done) => {
  try {
    done(null, user._id)
  } catch (error) {
    return done(error)
  }
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await services.getUserById(String(id))
    return done(null, user)
  } catch (error) {
    done(error)
  }
})

