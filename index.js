import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import roomsRoute from "./routes/rooms.js"
import hotelsRoute from "./routes/hotels.js"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api/auth',authRoute);
app.use('/api/users',usersRoute);
app.use('/api/hotels',hotelsRoute);
app.use('/api/rooms',roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

// MongoDb connection
const connectDb = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        throw error;
    }
};
mongoose.connection.on("disconnected",()=>{
    console.log("Database Disconnected!");
});
mongoose.connection.on("connected",()=>{
    console.log("Database connected!");
});
const PORT = 8000;
app.listen(PORT,()=>{
    connectDb();
    console.log(`server running on PORT ${PORT}`);
});