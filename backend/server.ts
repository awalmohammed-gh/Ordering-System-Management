import "dotenv/config"

import express from "express"
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cluodinary.js";
import productRouter from "./routes/productRoutes.js";

const app = express()

//app config
const port = process.env.PORT || 3000;

//middleware


//database
await connectDB();
connectCloudinary();


//api endpoint
app.use("/api/product", productRouter)

//listen to server
app.listen(port, () =>{
    console.log(`listen to server on http://localhost:${port}`);
})