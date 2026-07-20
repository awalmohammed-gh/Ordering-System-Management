import { uploadToCloudinary } from "../helper/cloudinary.js";
import { Product } from "../models/productModel.js";



//function to add product
export const addProduct = async(req,res) =>{
    try {
        const {name,price, category} = req.body;
        const image = req.file

         if (!image) {
           return res.status(400).json({
             message: "Image is required",
           });
         }

        const imageUrl = uploadToCloudinary(image);


        const product = await Product.create({
            name,
            price,
            category,
            image:imageUrl
        });

        return res.status({success:true, message:"Product added successfully", product})

    } catch (error) {
        console.error(error);
    }
}