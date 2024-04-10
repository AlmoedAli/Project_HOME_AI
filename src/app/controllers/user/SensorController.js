const sensor = require("../../models/sensor");
const device = require("../../models/device");
const { ObjectId } = require('mongodb');
const readingHistory = require("../../models/readinghistory");

class SensorController {

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
						state: device.State
					};
				});
				res.render("user/sensors", {
					layout: "main",
					sensors: devices,

				});
			})
			.catch(next);
	}

	async getSensor(req, res, next) {
		const dev = (await device.findById(req.params.id)).toObject();
        const sen = (await sensor.findOne({DeviceID: req.params.id})).toObject();
        const readinghistory = await readingHistory.find({ DeviceID: req.params.id });

		var data = [];
		readinghistory.forEach(item => {
			if (item.ReadingDateTime == null || item.ReadingValue == null)
				return;
			const readingDateTime = new Date(item.ReadingDateTime);
			const readingValue = item.ReadingValue;

			const readingDate = readingDateTime.toLocaleDateString();

			data.push({ date: readingDate, value: readingValue });
		});

		var sensorlabels = JSON.stringify(data.map(item => item.date));
		var sensordata = JSON.stringify(data.map(item => item.value));
        res.render("user/sensor_detail", {
            layout: "main", 
            device: dev, 
            sensor: sen,
            sensorlabels: sensorlabels,
			sensordata: sensordata,
			lastsensordata: data[data.length - 1].value
        });
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

    async index_modify(req, res, next) {
        const dev = (await device.findById(req.params.id)).toObject();
        // console.log(dev)
        const sen = (await sensor.findOne({DeviceID: req.params.id})).toObject();
        // console.log(sen)
                res.render('user/sensor_modify', {
                    layout: 'main',
                    device: dev,
                    sensor:sen
                })       
    }

	async sensor_modify(req, res, next) {
		const data = req.body;
		await device.findByIdAndUpdate(req.params.id, data);
        var SafetyRange={
            UpperBound : data.UpperBound,
            LowerBound : data.LowerBound
        }
        await sensor.findOneAndUpdate({DeviceID: req.params.id}, {SafetyRange});
		res.redirect("/sensor")
	}
}

module.exports = new SensorController();
