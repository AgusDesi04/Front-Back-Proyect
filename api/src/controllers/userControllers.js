import { faker } from '@faker-js/faker'
import UserDto from '../dto/userDto.js'
import * as services from '../services/userServices.js'
import { createResponse } from '../utils/utils.js'

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

export const registerMock = async (req, res, next) => {

  try {
    const first_name = faker.person.firstName()
    const last_name = faker.person.lastName()

    const userMock = {
      first_name: first_name,
      last_name: last_name,
      email: first_name + last_name + "@coder.com",
      age: faker.number.int({ max: 80 }),
      avatar: faker.image.avatar(),
      password: "hola1234"
    }

    const response = await services.registerMock(userMock)

    return createResponse(req, res, 200, response)

  } catch (error) {
    next(error)
  }


}

export const registerMultipleMocks = async (req, res, next) => {
  try {
    const quantity = parseInt(req.params.n, 10)

    if (!quantity || isNaN(quantity)) {
      return createResponse(req, res, 400, null, { msg: "you need to give a param" })
    }
    

    const mocks = []

    for (let i = 0; i < quantity; i++) {
      const first_name = faker.person.firstName()
      const last_name = faker.person.lastName()

      const userMock = {
        first_name: first_name,
        last_name: last_name,
        email: first_name + last_name + "@coder.com",
        age: faker.number.int({ max: 80 }),
        avatar: faker.image.avatar(),
        password: "hola1234"
      }

     await services.registerMock(userMock)
     mocks.push(userMock)
    }



    return createResponse(req, res, 200, {"mocks creados:": mocks})

  } catch (error) {
    next(error)
  }

}

