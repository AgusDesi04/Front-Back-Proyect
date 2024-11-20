import { addColors, createLogger, format, transports } from "winston"

const { colorize, simple } = format
const { Console, File } = transports

const levels = { fatal: 0, error: 1, info: 2, http: 3 }
const colors = { fatal: "red", error: "yellow", info: "blue", http: "white" }
addColors(colors)

const winstonLogger = createLogger({
  levels,
  format: colorize(),
  transports: [
    // primer nivel HTTP en consola
    new Console({ level: "http", format: simple() }),
    // segundo nivel de registro Error en archivo(y automaticamente en consola)
    new File({ level: "error", format: simple(), filename: "./src/utils/errors/errors.log" })

  ]
})

export default winstonLogger