const {
	getAllLaunches,
	existLaunchWithId,
	abortLaunchById,
	scheduleNewLaunch,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query);
	return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
	const launch = req.body;

	const { mission, rocket, launchDate, target } = launch;

	if (!mission || !rocket || !launchDate || !target) {
		return res.status(400).json({
			error: "Missing required launch properties",
		});
	}

	launch.launchDate = new Date(launch.launchDate);

	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: "Invalid launch date",
		});
	}

	await scheduleNewLaunch(launch);
	return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	if (!(await existLaunchWithId(launchId)))
		return res.status(400).json({
			error: "Launch not found",
		});

	const aborted = await abortLaunchById(launchId);
	return res.status(200).json({
		ok: true,
	});
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
