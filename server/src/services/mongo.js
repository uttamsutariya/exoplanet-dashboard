const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

/**
 * db connection handler
 */
mongoose.connection.once("open", () => {
	console.log(`DB connected!`);
});

mongoose.connection.on("error", (err) => {
	console.log(`${err.message}`);
});

async function mongoConnect() {
	mongoose.set("strictQuery", false);
	await mongoose.connect(DB_URL);
}

async function mongoDisconnect() {
	await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
