import CartsManager from "../daos/cartsManager.js"
import ProductsManager from "../daos/productsManager.js"
import * as services from "../services/ticketServices.js"
import { createResponse } from "../utils/utils.js"

export const addCarts = async (req, res, next) => {
  let products = []

  let carts = await CartsManager.getCarts()



  if (!carts) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: `No se encontro el archivo en el cual agregar carts` })

  }

  try {
    let newCart = await CartsManager.addCarts({ products })
    res.setHeader("content-type", "application/json");
    return res.status(201).json({ idCart: newCart._id, message: 'Se ha generado un nuevo carrito.' });

  } catch (error) {
    next(error)
  }
}

export const getCartsPopulated = async (req, res, next) => {

  let { cid } = req.params

  if (!cid) {
    res.setHeader("content-type", "aplication/json")
    return res.status(500).json({ error: "debes colocar un cart id!" })
  }

  try {
    let cart = await CartsManager.getCartsPopulated(cid)
    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ cart })

  } catch (error) {
    next(error)
  }






}

export const addProductInCart = async (req, res, next) => {
  // obtengo el carrito mediante el :cid y el producto mediante el :pid
  let { cid } = req.params
  let { pid } = req.params

  try {

    let addedProduct = await CartsManager.addProductInCart(cid, pid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ addedProduct })

  } catch (error) {

   next(error)

  }

}

export const deleteProductFromCart = async (req, res, next) => {
  let { cid } = req.params
  let { pid } = req.params

  try {
    let newCart = await CartsManager.removeProductFromCart(cid, pid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })


  } catch (error) {
    next(error)
  }

}

export const updateQuantProductInCart = async (req, res, next) => {
  let { cid } = req.params
  let { pid } = req.params
  let { quantity } = req.body

  try {

    if (isNaN(quantity) || quantity < 0) {
      res.setHeader("content-type", "aplication/json")
      return res.status(500).json({ error: "la cantidad debe ser un numero positivo" })
    }

    let newCart = await CartsManager.updateQuantity(cid, pid, quantity)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })

  } catch (error) {
    next(error)
  }
}

export const deleteAllProductsFromCart = async (req, res, next) => {
  let { cid } = req.params

  if (!cid) {
    res.setHeader("content-type", "aplication/json")
    return res.status(500).json({ error: "debes colocar un cart id!" })
  }

  try {
    let newCart = await CartsManager.deleteAllProducts(cid)

    res.setHeader("content-type", "aplication/json")

    return res.status(200).json({ newCart })

  } catch (error) {
    next(error)
  }

}

export const updateProductsFromCart = async (req, res, next) => {
  let { cid } = req.params;
  let { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Se debe proporcionar un array de productos." });
  }

  try {

    let cart = await CartsManager.getCartsPopulated(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    const existingProducts = await ProductsManager.getProducts();
    const existingProductIds = existingProducts.map(product => product._id.toString());

    const validProducts = products.filter(item => {
      return existingProductIds.includes(item.product) && item.quantity > 0;
    });

    if (validProducts.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron productos válidos para agregar al carrito." });
    }

    cart.products = validProducts.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));


    await CartsManager.updateCart(cart);

    return res.status(200).json({ message: "Carrito actualizado con éxito.", cart });

  } catch (error) {
    next(error)
  }
}

export const purchaseCart = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await services.purchaseCart(user);

    if (result.success) {
      if (result.unavailableProducts) {
        return createResponse(req, res, 200, {
          message: result.message,
          ticket: result.ticket,
          unavailableProducts: result.unavailableProducts,
        });
      } else {
        return createResponse(req, res, 200, {
          message: result.message,
          ticket: result.ticket
        });
      }
    } else {
      return createResponse(req, res, 400, null, {
        message: result.message,
        unavailableProducts: result.unavailableProducts || [],
      });
    }
  } catch (error) {
    next(error);
  }
}