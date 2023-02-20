const { getAllLaunches, addNewLaunch, existLaunchWithId, abortLaunchById } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
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

	addNewLaunch(launch);
	return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	if (!existLaunchWithId(launchId))
		return res.status(400).json({
			error: "Launch not found",
		});

	const aborted = abortLaunchById(launchId);
	return res.status(200).json(aborted);
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
