import { uploadToCloudinary } from "../helper/cloudinary.js";
import { Product } from "../models/productModel.js";
import type { Request, Response } from "express";

//function to add product
export const addProduct = async (req:Request, res:Response) => {
  try {
    const { name, price, category } = req.body;

    const image = await uploadToCloudinary(req.file!.path);

    const product = await Product.create({
      name,
      price,
      category,
      image,
    });

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listProduct = async (req:Request, res:Response) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const removeProduct = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};