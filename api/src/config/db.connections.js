import mongoose from "mongoose";
import args from "../utils/args.utils.js";
import env from "../utils/env.utils.js";

const mode = args.mode || 'prod'

export const connDB = async () => {
  try {

    await mongoose.connect(
      env.MONGO_URL,
    )
    console.log('DB CONECTADA EN EL MODO:' + " " + mode)
  } catch (error) {
    console.log(`error!! no se pudo conectar a la base de datos!! ${error}`)
  }
}
