import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(ENV.MONGO_URI);
		console.log("Database connected", conn.connection.host);
	} catch (error) {
		console.error("Error connecting to database", error);
	}
};
