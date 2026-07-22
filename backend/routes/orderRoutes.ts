import express from "express"
import { placeOrder, allOrders } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place-order", placeOrder)
orderRouter.get("/all-order", allOrders);

export default orderRouter;