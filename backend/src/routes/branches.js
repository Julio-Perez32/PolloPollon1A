import express from "express"
import branchesController from "../controller/branchesController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

//Router() nos ayuda a colocar los métodos que tendrá el endpoint

const router = express.Router();

//(api/branches/)
router.route("/")
.get(validateAuthCookie(["customer", "admin"]),branchesController.getBranches)
.post(validateAuthCookie(["admin"]), branchesController.createBranch)

//Definimos los method para el endpoint que includes un parámetro dinámico ":id". Este parámetro se utiliza para identificar un recurso específico, como un producto en este caso. Los métodos PUT y DELETE se utilizan para actualizar y eliminar un recurso específico identificado por su ID, respectivamente. 
//(api/branches/:id)
router.route("/:id")
.put(validateAuthCookie(["admin"]), branchesController.updateBranch)
.delete(validateAuthCookie(["admin"]), branchesController.deleteBranch)

export default router;