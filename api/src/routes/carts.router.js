import { Router } from "express";
import { addProductInCart, deleteAllProductsFromCart, deleteProductFromCart, getCartsPopulated, updateProductsFromCart, updateQuantProductInCart } from "../controllers/cartsController.js";
import { roleAuthorization } from "../middlewares/roleAuthorization.js";
import { passportCall } from "../passport/passportCall.js";

const cartsRouter = Router()



cartsRouter.get('/:cid', passportCall('current'), roleAuthorization('user'), getCartsPopulated)

cartsRouter.post("/:cid/products/:pid", passportCall('current'), roleAuthorization('user'),  addProductInCart)

cartsRouter.delete("/:cid/products/:pid", passportCall('current'), roleAuthorization('user'), deleteProductFromCart )

cartsRouter.put("/:cid/products/:pid", passportCall('current'), roleAuthorization('user'), updateQuantProductInCart )

cartsRouter.delete("/:cid", passportCall('current'), roleAuthorization('user'), deleteAllProductsFromCart )

cartsRouter.put("/:cid", passportCall('current'), roleAuthorization('user'), updateProductsFromCart);

cartsRouter.put("/:cid/purchase", passportCall('current'), roleAuthorization('user'), )

export default cartsRouter

