import type { Request, Response } from "express";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

// function to place order
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { orderName, items, notes, paymentMethod, paymentStatus } = req.body;

    if (!orderName || !items || items.length === 0) {
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

    const order = await Order.create({
      orderName,
      notes,
      items,
      total,
      paymentMethod:"cashier",
      paymentStatus:"unpaid",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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


//updating status
export const updateStatus = async(req:Request, res:Response) =>{
    try {
        const {orderId, status} = req.body;
           if (!orderId) {
             return res.status(404).json({
               success: false,
               message: "Order Id not found",
             });
           }

           if (!status) {
             return res.status(404).json({
               success: false,
               message: "Order status is required",
             });
           }

           const order = await Order.findById(orderId);
           if(!order){
            return res.status(403).json({success:false, message:"Order not found"})
           }

           order.paymentStatus = status;
           await order.save();

           return res.status(200).json({success:true, message:"status updated"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message:"Server error, failed to retrieved orders"})
    }
}