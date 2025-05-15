import dotenv from "dotenv";
import app from "./index.js";
import connect from "./db/index.js";
import { databaseLog } from "./utils/logger.js";

dotenv.config({
	path: "./env",
});

connect()
	.then(() => {
		app.on("error", (error) => {
			databaseLog(`!! CONNECTIVITY ERROR: ${error.message}`);
			console.log("!! CONNECTIVITY ERROR: ", error.message);

			throw error;
		});
		app.listen(process.env.PORT || 8080, () => {
			databaseLog(`!!! APP LISTENING ON PORT ${process.env.PORT} !!!`);
			console.log(`!!! APP LISTENING ON PORT ${process.env.PORT} !!!`);
		});
	})
	.catch((error) => {
		databaseLog(`!! MONGODB CONNECTION ERROR: ${error.message}`);
		throw error;
	});
