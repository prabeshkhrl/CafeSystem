import express from 'express'
import "dotenv/config"
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

import menuRouter from './routes/MenuRoute.js';
import userRouter from "./routes/UserRoute.js"
import restaurantRoutes from "./routes/restaurantRoute.js";
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
const PORT = process.env.PORT;
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());    


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,           // ← set on Render
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

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



