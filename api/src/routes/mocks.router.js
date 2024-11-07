import { Router } from "express";
import { registerMock, registerMultipleMocks } from "../controllers/userControllers.js";

const mocksRouter = new Router()

mocksRouter.get("/users", registerMock)

mocksRouter.get("/users/:n", registerMultipleMocks)

export default mocksRouter
