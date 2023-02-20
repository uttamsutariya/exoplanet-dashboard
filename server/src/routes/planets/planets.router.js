const express = require("express");

const router = express.Router();

// controllers

const { httpGetAllPlanets } = require("./planets.controller");

router.get("/", httpGetAllPlanets);

module.exports = router;
