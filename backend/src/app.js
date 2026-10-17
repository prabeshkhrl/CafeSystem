import express from 'express'
import dotenv from 'dotenv'
import menuRouter from './Routes/MenuRoute.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());    


app.use("/menu",menuRouter)

app.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
    
})

