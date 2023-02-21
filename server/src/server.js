require("dotenv").config();
const http = require("http");
const app = require("./app");

const { loadPlanets } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
	await mongoConnect();
	await loadPlanets();
	await loadLaunchData();

	server.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
}

startServer();
