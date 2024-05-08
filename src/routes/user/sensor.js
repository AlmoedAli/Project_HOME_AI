const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const sensorController = require("../../app/controllers/user/SensorController");

// router.get("/main", sensorController.getSensors);
router.get("/", isAuthenticated, sensorController.index);
router.get("/:id", isAuthenticated, sensorController.getSensor);
router.get("/:id/edit", isAuthenticated, sensorController.index_modify);
router.post("/:id/edit", isAuthenticated, sensorController.sensor_modify);
router.post("/add", isAuthenticated, sensorController.addNewSensor);
router.delete("/delete", isAuthenticated, sensorController.deleteAllSensors);

module.exports = router;
