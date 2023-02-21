const Launches = require("./launches.schema");
const Planets = require("./planets.schema");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100, // flight_number
	mission: "Kepler Exploration X", // name
	rocket: "Explorer IS1", // rocket.name
	launchDate: new Date("December 27, 2030"), // date_local
	target: "Kepler-442 b", // not applicable
	customers: ["NASA", "ZTM"], // payload.customers for each payload
	upcoming: true, // upcoming
	success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
	const res = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	});

	if (res.status !== 200) {
		console.log("Problem downloading launch data");
		throw new Error("Launch data download failed");
	}

	const launchDocs = res.data.docs;

	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"];
		const customers = payloads.flatMap((payload) => {
			return payload["customers"];
		});

		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers,
		};

		console.log(`${launch.flightNumber} ${launch.mission}`);

		await saveLaunch(launch);
	}
}

async function loadLaunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});

	if (firstLaunch) {
		console.log("Launch data already loaded");
	} else await populateLaunches();
}

async function saveLaunch(launch) {
	await Launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
}

async function getAllLaunches(skip, limit) {
	return await Launches.find({}, { _id: 0 }).sort({ flightNumber: 1 }).skip(skip).limit(limit);
}

async function getLatestFlightNumber() {
	const latestLaunch = await Launches.findOne().sort("-flightNumber");
	return !latestLaunch ? DEFAULT_FLIGHT_NUMBER : latestLaunch.flightNumber + 1;
}

async function scheduleNewLaunch(launch) {
	const planet = await Planets.findOne({ keplerName: launch.target });

	if (!planet) throw new Error("No matching planet found");

	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ["ZTM", "NASA", "SPACEX"],
		flightNumber: await getLatestFlightNumber(),
	});

	await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
	return await Launches.findOne(filter);
}

async function existLaunchWithId(launchId) {
	return await findLaunch({ flightNumber: launchId });
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
	loadLaunchData,
	getAllLaunches,
	scheduleNewLaunch,
	existLaunchWithId,
	abortLaunchById,
};
