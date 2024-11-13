class customError {
  static newError({message, statusCode}){
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
  }
}

export default customError