import mongoose from "mongoose";
import { ATLAS_DB_URL, NODE_ENV } from "./env";

export async function connectDB() {
	try {
		if (NODE_ENV == "development") {
			await mongoose.connect(ATLAS_DB_URL);
			console.log("Connected to the Database");
		}
	} catch (error) {
		console.log("Error connecting to the database");
		console.log(error);
		process.exit(1);
	}
}
