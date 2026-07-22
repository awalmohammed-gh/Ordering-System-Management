import type { Request, Response } from "express";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

// function to place order
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { orderName, amount, items } = req.body;

    if (!orderName || !amount || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order details are required",
      });
    }

    let total = 0;

    // calculate total from database prices
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      total += product.price * item.quantity;
    }

    // calculate customer change
    const change = amount - total;

    if (change < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient amount",
      });
    }

    const order = await Order.create({
      orderName,
      items,
      total,
      amountReceived: amount,
      change,
      paymentMethod: "cash",
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const allOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};