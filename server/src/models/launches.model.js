const Launches = require("./launches.schema");
const Planets = require("./planets.schema");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration X",
	rocket: "Explorer IS1",
	launchDate: new Date("December 27, 2030"),
	target: "Kepler-442 b",
	customers: ["NASA", "ZTM"],
	upcoming: true,
	success: true,
};

saveLaunch(launch);

async function saveLaunch(launch) {
	const planet = await Planets.findOne({ keplerName: launch.target });

	if (!planet) return new Error("No matching planet found");

	await Launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
}

async function getAllLaunches() {
	return await Launches.find({}, { _id: 0 });
}

async function getLatestFlightNumber() {
	const latestLaunch = await Launches.findOne().sort("-flightNumber");
	return !latestLaunch ? DEFAULT_FLIGHT_NUMBER : latestLaunch.flightNumber + 1;
}

async function scheduleNewLaunch(launch) {
	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ["ZTM", "NASA", "SPACEX"],
		flightNumber: await getLatestFlightNumber(),
	});

	await saveLaunch(newLaunch);
}

async function existLaunchWithId(launchId) {
	return await Launches.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
	return await Launches.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	);
}

module.exports = {
	getAllLaunches,
	scheduleNewLaunch,
	existLaunchWithId,
	abortLaunchById,
};
