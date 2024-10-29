import { Router } from "express";
import passport from "passport";
import { login, passportResponse, profile, register, getCurrentUserDto } from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { passportCall } from "../passport/passportCall.js";


const usersRouter = Router()

usersRouter.post('/register', register)

usersRouter.post('/login', login)

usersRouter.get('/private', isAuth, (req, res) => res.send('INFORMACION CONFIDENCIAL'))

usersRouter.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }))

usersRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), passportResponse)

usersRouter.get('/oauth2/redirect/accounts.google.com', passport.authenticate('google', { assignProperty: 'user' }), passportResponse)

usersRouter.get('/current', passportCall('current'), getCurrentUserDto);


export default usersRouter
