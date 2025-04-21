import mongoose from "mongoose";
import 'dotenv/config';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

export default connectMongoDB;
