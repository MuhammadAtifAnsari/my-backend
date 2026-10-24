import mongoose from "mongoose";
import 'dotenv/config';
import path from 'path';
import dotenv from "dotenv";
import dns from "dns"; 

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// 3. IPv4 resolution ko priority dene ke liye default result order set kiya
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}




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