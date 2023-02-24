const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");

const app = express();

// headers security middleware
app.use(helmet());

const api_v1 = require("./routes/api_v1");

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(morgan("dev"));

app.use("/v1", api_v1);

const buildPath = path.join(__dirname, "../../client/build");

app.use(express.static(buildPath));

app.get("/*", (req, res) => {
	res.sendFile(`${buildPath}/index.html`);
});

module.exports = app;
