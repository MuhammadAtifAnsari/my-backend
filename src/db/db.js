import mongoose from "mongoose";
import 'dotenv/config';
import path from 'path';
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), '.env') }); 
 

async function mongoDB_Connect() {
    try {
        if (!process.env.MONGODB_URI) {
            console.log("error in MONGODB_URI");
            return
        }

        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongo_db connect successfully!");

    } catch (error) {
        console.error(error);
        console.log("error in database connection!");
    }
}

export default mongoDB_Connect;