import UserDto from '../dto/userDto.js'
import * as services from '../services/userServices.js'
import { createResponse } from '../utils.js'

export const register = async (req, res, next) => {
  try {
    const response = await services.register(req.body)
    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const token = await services.login(req.body)
    res.cookie('token', token, { httpOnly: true })
    !token ? createResponse(req, res, 404, null, token) : createResponse(req, res, 200, token)
  } catch (error) {
    next(error)
  }
}

export const passportResponse = async (req, res, next) => {
  try {
    const { first_name, last_name, email, isGithub, isGoogle } = req.user
    res.json({
      message: 'login ok!',
      session: req.session,
      user: {
        first_name,
        last_name,
        email,
        isGithub,
        isGoogle
      }
    })
  } catch (error) {
    next(error)
  }
}

export const profile = async (req, res, next) => {
  try {
    if (req.user) return createResponse(req, res, 200, req.user)
    createResponse(req, res, 403, null, { msg: 'Unauthorized!' })
  } catch (error) {
    next(error)
  }
}

export const getCurrentUserDto = async (req, res, next) => {
  try {
    if (!req.user) return createResponse(req, res, 403, null, { msg: 'Unauthorized!' })
    const newDto = new UserDto(req.user)
    return createResponse(req, res, 200, newDto)


  } catch (error) {
    next(error)
  }
}

