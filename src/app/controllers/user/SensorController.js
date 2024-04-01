const sensor = require("../../models/sensor");
const device = require("../../models/device");

class SensorController {
	getSensors(req, res, next) {
		const devices = [];
		for (let i = 0; i < 10; i++)
			devices.push({
				name: "Cảm biến nhiệt độ",
				value: 30,
				location: "Phòng khách",
			});
		res.render("sensor/sensors", {
			layout: "main",
			sensors: devices,
			selections: [
				{ value: "Tên cảm biến" },
				{ value: "Loại cảm biến" },
				// { value: "c" },
				// { value: "d" },
				// { value: "e" },
				// { value: "f" },
			],
		});
	}

	index(req, res, next) {
		device
			.find({ Type: "sensor" })
			.then((devicesOb) => {
				const devices = devicesOb.map((device) => {
					return {
						_id: device._id,
						name: device.Name,
						location: device.Location,
						type: device.Type,
						state: device.State,
						installationDate: device.InstallationDate,
						powerConsumption: device.PowerConsumption,
					};
				});
				res.render("user/sensor", {
					layout: "main",
					sensors: devices,
				});
			})
			.catch(next);
	}

	async addNewSensor(req, res, next) {
		const { name, location, type, specificType, powerconsumption } =
			req.body;
		const state = true;
		const installationDate = new Date("2024-03-22");

		try {
			const newEquip = await device.create({
				Name: name,
				Location: location,
				Type: type,
				State: state,
				InstallationDate: installationDate,
				PowerConsumption: parseFloat(powerconsumption),
			});
			await sensor.create({
				DeviceID: newEquip._id,
				SensorType: specificType,
				ReadingHistory: {},
			});
			res.status(201).json({ status: "success" });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "An error occurred while add new device",
			});
		}
	}

	async deleteAllSensors(req, res, next) {
		try {
			const sensors = await sensor.deleteMany({});
			if (!sensors || sensors.deletedCount === 0) {
				return res
					.status(404)
					.json({ error: "No electricity sensors found" });
			}
			res.json({
				message: `${sensors.deletedCount} electricity sensors deleted successfully`,
			});
		} catch (error) {
			console.error("Error deleting electricity sensors:", error);
			res.status(500).json({
				error: "An error occurred while deleting the electricity sensors",
			});
		}
	}

    index_modify(req, res, next) {
        device.find({ Type: 'sensor' })
            .then(devicesOb => {
                const devices = devicesOb.map(device => {
                    return {
                        _id: device._id,
                        name: device.Name,
                        location: device.Location,
                        type: device.Type,
                        state: device.State,
                        installationDate: device.InstallationDate,
                        powerConsumption: device.PowerConsumption,
                    }
                })
                res.render('user/sensor_modify', {
                    layout: 'main',
                    sensors: devices
                })
            })
            .catch(next);
    }
}

module.exports = new SensorController();
