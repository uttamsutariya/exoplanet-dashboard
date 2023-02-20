const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const results = [];

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
			.on("data", (data) => {
				if (isHabitablePlanet(data)) results.push(data);
			})
			.on("end", () => resolve())
			.on("error", (error) => reject(error.message));
	});
}

module.exports = {
	loadPlanets,
	planets: results,
};
