import "dotenv/config"

import express from "express"
import { connectDB } from "./config/db.js";

const app = express()

//app config
const port = process.env.PORT || 3000;

//middleware


//database
await connectDB()


//api endpoint
app.get("/", (req,res) =>{
    res.json({message:"server is live"})
})

//listen to server
app.listen(port, () =>{
    console.log(`listen to server on http://localhost:${port}`);
})