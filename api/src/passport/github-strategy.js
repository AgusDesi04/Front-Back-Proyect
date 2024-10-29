import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import * as services from "../services/userServices.js";
import 'dotenv/config'

const strategyConfig = {
  clientID: process.env.CLIENT_ID_GITHUB,
  clientSecret: process.env.CLIENT_SECRET_GITHUB,
  callbackURL: 'http://localhost:8080/users/github'
}

const registerOrLogin = async (accesToken, refreshToken, profile, done) => {
  try {
    console.log(profile)
    const email = profile._json.email !== null ? profile._json.email : profile._json.notification_email

    const user = await services.getUserByEmail(email)
    if(user) return done(null, user)
    
    const newUser = await services.register({
      first_name: profile._json.name.split(' ')[0],
      last_name:  profile._json.name.split(' ').length > 2 ?  profile._json.name.split(' ').pop() :  profile._json.name.split(' ')[1],
      email,
      password: '', 
      isGithub: true

    })

    return done(null, newUser)



  } catch (error) {
    return done(error.message)
  }
}



passport.use('github', new GithubStrategy(strategyConfig, registerOrLogin))



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