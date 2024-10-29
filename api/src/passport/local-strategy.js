import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as services from "../services/userServices.js";

const strategyConfig = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

const signUp = async (req, email, password, done) => {
  try {
    const user = await services.getUserByEmail(email)
    if (user) return done(null, false, { message: 'user exists' })
    const newUser = await services.register(req.body)
    return done(null, newUser)

  } catch (error) {
    return done(error.message)
  }
}

const login = async (req, email, password, done) => {
  try {
    const userLogin = await services.login(email, password)
    if (!userLogin) return done(null, false, { message: 'login unauthorized' })
    return done(null, userLogin)
  } catch (error) {
    return done(error.message)
  }
}

const loginStrategy = new LocalStrategy(strategyConfig, login)

const signUpStrategy = new LocalStrategy(strategyConfig, signUp)


passport.use('login', loginStrategy)

passport.use('register', signUpStrategy)


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