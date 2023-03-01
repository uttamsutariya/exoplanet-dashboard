const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const Planets = require("./planets.schema");

function isHabitablePlanet(palnet) {
	return (
		palnet["koi_disposition"] === "CONFIRMED" &&
		palnet["koi_insol"] > 0.36 &&
		palnet["koi_insol"] < 1.11 &&
		palnet["koi_prad"] < 1.6
	);
}

function loadPlanets() {
	return new Promise((resolve, reject) => {
		fs.createReadStream(path.join(__dirname, "../../data/kepler_data.csv"))
			.pipe(
				parse({
					comment: "#",
					columns: true,
				})
			)
			.on("data", async (data) => {
				if (isHabitablePlanet(data)) {
					savePlanet(data);
				}
			})
			.on("end", async () => {
				const countPlanetsFound = (await getAllPlanets()).length;
				console.log(`${countPlanetsFound} habitable planets found`);
				resolve();
			})
			.on("error", (error) => reject(error.message));
	});
}

async function getAllPlanets() {
	return await Planets.find({}, { _id: 0 });
}

async function savePlanet(data) {
	await Planets.updateOne(
		{
			keplerName: data.kepler_name,
		},
		{
			keplerName: data.kepler_name,
		},
		{
			upsert: true,
		}
	);
}

module.exports = {
	loadPlanets,
	getAllPlanets,
};
