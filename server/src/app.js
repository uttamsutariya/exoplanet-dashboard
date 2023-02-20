const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(morgan("dev"));

const buildPath = path.join(__dirname, "../../client/build");

app.use(express.static(buildPath));

// routes
const planetRoutes = require("./routes/planets/planets.router");
const launchesRoutes = require("./routes/launches/launches.router");

app.use("/planets", planetRoutes);
app.use("/launches", launchesRoutes);

app.get("/*", (req, res) => {
	res.sendFile(`${buildPath}/index.html`);
});

module.exports = app;
