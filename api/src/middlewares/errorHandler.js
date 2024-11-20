import errors from "../utils/errors/errors.js";
import winstonLogger from "../utils/winston.util.js"

export const errorHandler = (error, req, res, next) => {
  const  message = `${req.method} ${req.url} - ${error.message.toUpperCase()}`
  if(error.statusCode){
    winstonLogger.error(message)
  }else{
    winstonLogger.fatal(message)
    console.log(error)
  }

  const { fatal } = errors

  return res
  .status(errors.statusCode || fatal.statusCode)
  .json({ message: errors.message || fatal.message })

}





// export const errorHandler = (error, req, res, next) =>{
//   console.log(error.stack)
//   const status = error.status || 500
//   res.status(status).send(error.message)
// }