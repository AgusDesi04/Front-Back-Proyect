import CartsManager from "../daos/cartsManager.js";
import ProductsManager from "../daos/productsManager.js";
import ticketManager from "../daos/ticketManager.js";


export const purchaseCart = async (user) => {
  try {
    const cartId = user.cart;
    const userEmail = user.email;
    const cart = await CartsManager.getCartById(cartId);
    const productsToPurchase = [];
    const productsOutOfStock = [];
    let totalAmount = 0;

    if (cart && cart.products.length > 0) {
      for (const item of cart.products) {
        const product = await ProductsManager.getById(item.product);
        if (product && product.stock >= item.quantity) {
          productsToPurchase.push(item);
          totalAmount += product.price * item.quantity;
        } else {
          productsOutOfStock.push(item);
        }
      }

      if (productsToPurchase.length > 0) {
        for (const item of productsToPurchase) {
          await ProductsManager.updateProductStock(item.product, item.quantity);
        }
        const ticket = await ticketManager.createTicket({
          amount: totalAmount,
          purchaser: userEmail,
        });

        const remainingProducts = cart.products.filter(item => productsOutOfStock.includes(item));
        await CartsManager.updateCart(cartId, { products: remainingProducts });

        if (productsOutOfStock.length === 0) {
          return {
            success: true,
            message: "Compra completada con éxito.",
            ticket,
          };
        } else {
          return {
            success: true,
            message: "Compra parcial completada. Algunos productos no tenían suficiente stock.",
            ticket,
            unavailableProducts: productsOutOfStock,
          };
        }
      } else {
        return {
          success: false,
          message: "Compra no completada. Ninguno de los productos tenía stock suficiente.",
          unavailableProducts: productsOutOfStock,
        };
      }
    } else {
      return {
        success: false,
        message: "El carrito está vacío o no se pudo encontrar.",
      };
    }
  } catch (error) {
    throw new Error("Error al procesar la compra: " + error.message);
  }
};
