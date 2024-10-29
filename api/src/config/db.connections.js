import 'dotenv/config';
import mongoose from "mongoose";
export const connDB = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URL,
      { dbName: "practicas-backend2" }
    )
    console.log('DB CONECTADA!!')
  } catch (error) {
    console.log(`error!! no se pudo conectar a la base de datos!! ${error}`)
  }
}
