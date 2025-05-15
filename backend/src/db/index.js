import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { databaseLog } from "../utils/logger.js";

// Connect to MongoDB
async function connect() {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${DB_NAME}`
		);
		databaseLog(
			`!! MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`
		);
		console.log();
		
	} catch (error) {
		databaseLog(`!! MONGODB CONNECTION ERROR: ${error.message}`);
		process.exit(1);
	}
}

export default connect;
