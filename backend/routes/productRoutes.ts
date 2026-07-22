import express from "express"
import { addProduct, listProduct, removeProduct } from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post("/create-product", upload.single("image"), addProduct);
productRouter.get("/list",listProduct);
productRouter.delete("/remove-product/:id",removeProduct);


export default productRouter;