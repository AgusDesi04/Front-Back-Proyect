import { faker } from '@faker-js/faker';
import ProductsManager from "../daos/productsManager.js";

export const getProductsPaginated = async (req, res, next) => {

  let { page = 1, limit = 10, sort = null, filter = null } = req.query

  if (isNaN(Number(page)) || Number(page) < 1) {
    page = 1;
  }

  if (isNaN(Number(limit)) || Number(limit) < 1) {
    limit = 10;
  }

  try {

    const productsData = await ProductsManager.getProductsPaginate({
      page,
      limit,
      sort,
      filter
    });

    const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productsData;

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      products,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      currentPage: page,
      limit,
      sort,
      filter
    });
  } catch (error) {
    next(error)
  }
}

export const findProductById = async (req, res, next) => {
  let { pid } = req.params

  try {
    id = parseInt(pid, 10);

    if (isNaN(id)) {
      res.setHeader("content-type", "aplication/json")
      return res.status(400).send("El id debe ser numerico!!")
    }



    let products = await ProductsManager.getProducts()

    let product = products.find(p => p.id === id)

    if (!product) {
      res.setHeader("content-type", "aplication/json")
      return res.status(400).send(`El producto con el id: ${id} no se encuentra entre los productos registrados!`)
    }

    res.status(200).json({ product })
  } catch (error) {
    next(error)
  }
}

export const addProduct = async (req, res, next) => {
  let { title, description, code, price, status, stock, category } = req.body

  // VALIDACIONES

  const existingProduct = await ProductsManager.getProductByCode(code);
  if (existingProduct) {
    return res.status(400).json({ error: 'El código de producto ya existe.' });
  }

  if (!title || !description || !code || !price || !stock || !category) {
    res.setHeader("content-type", "aplication/json")
    return res.status(400).json({ error: "complete todas las propiedades!" })
  }

  if (!status) {
    status = true
  }


  // CARGA DEL NUEVO PRODUCTO

  try {
    let newProduct = await ProductsManager.addProducts({ title, description, code, price, status, stock, category })
    res.setHeader("content-type", "aplication/json")
    return res.status(200).json({ newProduct })

  } catch (error) {
    next(error)
  }

}

export const updateProduct = async (req, res, next) => {
  const { pid } = req.params;
  const productUpdates = req.body;


  try {
    const updatedProduct = await ProductsManager.updateProduct(pid, productUpdates);

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct
    });
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  let { id } = req.params

  try {
    let resultado = await ProductsManager.deleteProducts(id)
    if (!resultado) {
      res.setHeader("content-type", "aplication/json")
      return res.status(500).json({ error: `error al eliminar!!` })
    } else {
      res.setHeader("content-type", "aplication/json")
      return res.status(200).json({ payload: "producto eliminado" })
    }



  } catch (error) {
    next(error)
  }

}
export const addProductsMocks = async (req, res, next) => {

  try {
    const quantity = parseInt(req.params.n, 10)

    if (!quantity || isNaN(quantity)) {
      return createResponse(req, res, 400, null, { msg: "you need to give a param" })
    }

    const productMocks = []

    for (let i = 0; i < quantity; i++) {
      const product = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code: "mockCode:" + faker.number.int({ max: 100 }),
        price: faker.number.int({ max: 10000 }),
        stock: faker.number.int({ max: 100 }),
        category: faker.commerce.department()
      }
    }



  } catch (error) {
    next(error)
  }




}