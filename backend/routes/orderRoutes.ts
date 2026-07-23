import express from "express"
import { placeOrder, allOrders, updateStatus } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place-order", placeOrder)
orderRouter.get("/all-order", allOrders);
orderRouter.post("/update-status", updateStatus);

export default orderRouter;