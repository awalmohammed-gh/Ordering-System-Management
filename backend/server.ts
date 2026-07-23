import "dotenv/config"

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cluodinary.js";
import productRouter from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express()

//app config
const port = process.env.PORT || 3000;

//middleware
const allowOrigins =["http://localhost:5174","http://localhost:5173"]
app.use(cors({
    origin:allowOrigins,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())



//database
await connectDB();
connectCloudinary();


//api endpoint
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

//listen to server
app.listen(port, () =>{
    console.log(`listen to server on http://localhost:${port}`);
})