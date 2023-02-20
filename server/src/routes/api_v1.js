const express = require("express");

const api = express.Router();

// routes
const planetRoutes = require("./planets/planets.router");
const launchesRoutes = require("./launches/launches.router");

api.use("/planets", planetRoutes);
api.use("/launches", launchesRoutes);

module.exports = api;
