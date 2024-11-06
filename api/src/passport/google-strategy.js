import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as services from "../services/userServices.js";
import env from "../utils/env.utils.js"

const strategyConfig = {
  clientID: env.CLIENT_ID_GOOGLE,
  clientSecret: env.CLIENT_SECRET_GOOGLE,
  callbackURL: '/users/oauth2/redirect/accounts.google.com',
  scope: ['profile', 'email'],
  state: true
}

const registerOrLogin = async (accesToken, refreshToken, profile, done) => {
  try {
    console.log(profile)
    const email = profile._json.email

    const user = await services.getUserByEmail(email)
    if(user) return done(null, user)
    
    const newUser = await services.register({
      first_name: profile._json.given_name,
      last_name:  profile._json.family_name,
      email,
      password: '', 
      avatar: profile._json.picture,
      isGoogle: true
      

    })

    return done(null, newUser)



  } catch (error) {
    return done(error.message)
  }
}



passport.use('google', new GoogleStrategy(strategyConfig, registerOrLogin))



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