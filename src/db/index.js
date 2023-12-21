import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
import 'dotenv/config'

const connectDb = async () => {
    try {
        const connectionDatabase = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB host ${connectionDatabase.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED: ", error);
        process.exit(1)
    }
}

export default connectDb