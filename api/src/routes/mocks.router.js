import { Router } from "express";
import { registerMock, registerMultipleMocks } from "../controllers/userControllers.js";
import { addProductsMocks } from "../controllers/productsController.js";

const mocksRouter = new Router()

mocksRouter.get("/users", registerMock)

mocksRouter.get("/users/:n", registerMultipleMocks)

mocksRouter.get("/products/:n", addProductsMocks)

export default mocksRouter
