import express from "express"
import { addProduct } from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post("/create-product", upload.single("image"), addProduct);


export default productRouter;