const sensor = require("../../models/sensor");
const device = require("../../models/device");
const house = require("../../models/house");
const { ObjectId } = require('mongodb');
const readingHistory = require("../../models/readinghistory");

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

class SensorController {

	async index(req, res, next) {
		const user = req.session.user;

		const housesOb = await house.find({ UserID: user._id });
		const houses = await Promise.all(housesOb.map(async (house) => {
			const devicesOb = await sensor.find().populate({
                path: 'DeviceID',
                match: { Type: "sensor", HouseID: house._id }
            });
			if (!devicesOb[0].DeviceID) {
				return { ...house.toObject(), devices: [] };
			}
			const devices = devicesOb.map((device) => {
				return {
					_id: device.DeviceID._id,
					name: device.DeviceID.Name,
					location: device.DeviceID.Location,
					type: device.DeviceID.Type,
					equipType: device.SensorType,
				};
			});
			return { ...house.toObject(), devices };
		}));

		res.render("user/sensors", {
			layout: "main",
			houses: houses,
		});
	}

	async getSensor(req, res, next) {
		try {
			const dev = (await device.findById(req.params.id)).toObject();
			const sen = (await sensor.findOne({ DeviceID: req.params.id })).toObject();
	
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
	
			const sensorlabels = JSON.stringify(data.map(item => item.date));
			const sensordata = JSON.stringify(data.map(item => item.value));
	
			res.render("user/sensor_detail", {
				layout: "main",
				device: dev,
				sensor: sen,
				sensorlabels: sensorlabels,
				sensordata: sensordata,
				lastsensordata: data[data.length - 1].value,
				AIO_USERNAME: AIO_USERNAME,
				AIO_KEY: AIO_KEY
			});
			
		} catch (error) {
			next(error);
		}
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
