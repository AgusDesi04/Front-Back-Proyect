import { dirname } from 'path'
import { fileURLToPath } from 'url'
export const __dirname = dirname(fileURLToPath(import.meta.url))

import { compare, genSalt, hash } from "bcrypt"


/**
 * hashing method with bcrypt
 * @param {*} password string(unhashed password)
 * @returns string (password hashed)
 */
export const createHash = async (password) => hash(password, await genSalt(10))


/**
 * compares passwords saved in user with password recived by param
 * @param {*} password string(unhashed password)
 * @param {*} user (hashed password saved in user)
 * @returns boolean
 */
export const isValidPassword = async (password, hashedPassword) => compare(password, hashedPassword)

// ---------------------------------------------------------------------------------------------------------------------------------------

export const createResponse = (req, res, statusCode, data, error = null) => {
  return res.status(statusCode).json({
    data, 
    status: statusCode,
    error,
    path: req.url
  })
}

