import express from "express"
import wompiController from "../controller/wompiController.js";

//Router() allow us to place the methods that the endpoint will have

const router = express.Router();

router.route("/token").post(wompiController.generateToken)
router.route("/paymentTest").post(wompiController.paymentTest)
router.route("/payment3DS").post(wompiController.payment3DS)

export default router;