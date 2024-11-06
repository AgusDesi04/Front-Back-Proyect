import {config} from "dotenv"
import args from "./args.utils.js"

const { mode } = args
const path = ".env."+mode
config({ path })

export default {
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET_KEY,

  CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,

  CLIENT_ID_GOOGLE: process.env.CLIENT_ID_GOOGLE,
  CLIENT_SECRET_GOOGLE: process.env.CLIENT_SECRET_GOOGLE

}