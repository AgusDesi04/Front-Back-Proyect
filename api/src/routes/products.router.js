import { Router } from "express";
import ProductsManager from "../daos/productsManager.js";
import { getProductsPaginated, findProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";
import { roleAuthorization } from "../middlewares/roleAuthorization.js";
import { passportCall } from "../passport/passportCall.js";


const productsRouter = Router()

ProductsManager.path = "./src/data/products.json"

productsRouter.get("/", getProductsPaginated);

productsRouter.get("/:pid", findProductById)


productsRouter.post("/", passportCall('current'), roleAuthorization('admin'), addProduct)

productsRouter.put("/:pid", passportCall('current'), roleAuthorization('admin'), updateProduct);


productsRouter.delete("/:id", passportCall('current'), roleAuthorization('admin'), deleteProduct)

export default productsRouter