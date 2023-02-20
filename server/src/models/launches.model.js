const launches = new Map();

let latestFLightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: "Kepler Exploration X",
	rocket: "Explorer IS1",
	launchDate: new Date("December 27, 2030"),
	target: "Kepler-442 b",
	customer: ["NASA"],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	launches.set(
		++latestFLightNumber,
		Object.assign(launch, {
			flightNumber: latestFLightNumber,
			upcoming: true,
			success: true,
		})
	);
}

function existLaunchWithId(launchId) {
	return launches.has(launchId);
}

function abortLaunchById(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	existLaunchWithId,
	abortLaunchById,
};
