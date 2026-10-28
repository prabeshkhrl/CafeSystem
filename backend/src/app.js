import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import adminRoutes from "./Routes/adminRoutes.js";

import menuRouter from './Routes/MenuRoute.js';
import userRouter from "./Routes/UserRoute.js"
import restaurantRoutes from "./Routes/restaurantRoute.js";
import mongoose from 'mongoose';
import authRoutes from "./Routes/authRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());    




app.use(cors({
  origin: [
    "http://localhost:5173",   // Vite
  ],
  credentials: true,
}));
app.use("/api/admins", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu-items",menuRouter)
app.use("/api/users",userRouter)
app.use("/api/restaurants", restaurantRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Database Connected sucessfully', mongoose.connection.name);
app.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
    
})
    
}).catch((err) => console.error('MongoDB connection error:', err));



