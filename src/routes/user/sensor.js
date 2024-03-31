const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const sensorController = require("../../app/controllers/user/SensorController");

router.get("/main", sensorController.getSensors);
router.get("/", sensorController.index);
router.post("/add", sensorController.addNewSensor);
router.delete("/delete", sensorController.deleteAllSensors);

module.exports = router;
