import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const DBConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Error connecting to MongoDB. Details: ${error.message}`)
        return;
    }
}

export default DBConnection;