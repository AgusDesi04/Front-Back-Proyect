import { createHash, isValidPassword } from "../utils/utils.js";
import { UserModel } from "./models/userModel.js";

export default class usersManager {

  static async existsUser(email) {
    try {
      return await UserModel.findOne({ email: email })
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getById(id) {
    try {
      return await UserModel.findById(id)
    } catch (error) {
      throw new Error(error)
    }
  }

  static async register(user) {
    try {
      return await UserModel.create(user)
    } catch (error) {
      throw new Error(error)
    }
  }

  static async login(email, password) {
    try {
      const userExists = await UserModel.findOne({ email })
      if (userExists) {
        const passValid = await isValidPassword(password, userExists)

        if (!passValid) return passValid
        else return userExists
      }
    } catch (error) {
      throw new Error(error)
    }
  }

}