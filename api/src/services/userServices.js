import jwt from 'jsonwebtoken'
import CartsManager from "../daos/cartsManager.js"
import usersManager from "../daos/usersManager.js"
import { createHash, isValidPassword } from "../utils.js"



export const getUserByEmail = async (email) => {
  try {
    return await usersManager.existsUser(email)
  } catch (error) {
    throw new Error(error)
  }
}

export const getUserById = async (id) => {
  try {
    return await usersManager.getById(id)
  } catch (error) {
    throw new Error(error)
  }
}

export const generateToken = (user, time = '5m') => {
  const payload = {
    userId: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    cart: user.cart,
  }

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: time })
  return token

}

export const register = async (user) => {
  try {
    const { email, password } = user
    const existsUser = await getUserByEmail(email)

    if (!existsUser) {
      const cartUser = await CartsManager.addCarts()
      const newUser = await usersManager.register({
        ...user,
        password: await createHash(password),
        cart: cartUser._id
      })

      return newUser
    } else {
      return null
    }

  } catch (error) {
    throw new Error(error)
  }
}

export const login = async ({ email, password }) => {
  try {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      const passValid = await isValidPassword(password, userExists.password);
      if (!passValid) return null;
      return generateToken(userExists);
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};