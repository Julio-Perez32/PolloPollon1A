import express from "express"
import productsController from "../controller/productsController.js";

//Router() nos ayuda a colocar los métodos que tendrá el endpoint
const router = express.Router();

//(api/products/)
router.route("/")
.get(productsController.getProducts)
.post(productsController.createProducts)

//Additional endpoints for specific product operations

router.route("/searchByName").post(productsController.searchByName)

router.route("/low-stock").get(productsController.lowStock)

router.route("/price-range").post(productsController.getProductsByPriceRange)

router.route("/count").get(productsController.countProducts)

//Definimos los métodos para el endpoint que incluye un parámetro dinámico ":id". Este parámetro se utiliza para identificar un recurso específico, como un producto en este caso. Los métodos PUT y DELETE se utilizan para actualizar y eliminar un recurso específico identificado por su ID, respectivamente. 
//(api/products/:id)
router.route("/:id")
.put(productsController.updateProducts)
.delete(productsController.deleteProducts)
.get(productsController.getProductById)

export default router;