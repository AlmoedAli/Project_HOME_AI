const equipment = require("../../models/equipment");
const device = require("../../models/device");
const house = require("../../models/house");
const { ObjectId } = require('mongodb');
const usageHistory = require("../../models/usagehistory");

const axios = require('axios');

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

axios.defaults.headers.common['X-AIO-Key'] = process.env.AIO_KEY;
const baseUrl = `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}`;

const ValueTable = Object.freeze({
    "Quạt": "40",
    "Đèn": "1",
    "Cửa": "1",
});

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

class EquipmentController {
	async getEquipment(req, res, next) {
		const dev = (await device.findById(req.params.id)).toObject();
        const equip = (await equipment.findOne({DeviceID: req.params.id})).toObject();
		const usagehistory = await usageHistory.find({ DeviceID: req.params.id });

		var data = [];
		usagehistory.forEach(item => {
			if (item.UsageStartTime == null || item.UsageEndTime == null)
				return;
			const startTime = new Date(item.UsageStartTime);
			const endTime = new Date(item.UsageEndTime);

			const startDate = startTime.toLocaleDateString();
			const duration = (endTime - startTime) / (1000 * 60 * 60);

			const existingEntry = data.find(entry => entry.date === startDate);

			if (existingEntry) {
				existingEntry.time += duration;
			} else {
				data.push({ date: startDate, time: duration });
			}
		});
		var timelabels = JSON.stringify(data.map(item => item.date))
		var timedata = JSON.stringify(data.map(item => item.time))

        res.render("user/equipment_detail", {
            layout: "main", 
            device: dev, 
            equipment: equip,
            timelabels: timelabels,
			timedata: timedata,
			AIO_USERNAME: AIO_USERNAME,
			AIO_KEY: AIO_KEY
        });
	}

	async index(req, res, next) {
		const user = req.session.user;

		const housesOb = await house.find({ UserID: user._id });
		const houses = await Promise.all(housesOb.map(async (house) => {
			const devicesOb = await equipment.find().populate({
                path: 'DeviceID',
                match: { Type: "electricity", HouseID: house._id }
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
					adaID: device.DeviceID.AdaID,
					state: device.State,
					AIO_KEY: process.env.AIO_KEY,
					AIO_USERNAME: process.env.AIO_USERNAME,
					equipType: device.ElectricityEqType,
				};
			});
			return { ...house.toObject(), devices };
		}));
		res.render("user/equipments", {
			layout: "main",
			houses: houses,
		});
	}

	async addNewEquipment(req, res, next) {
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
			await equipment.create({
				DeviceID: newEquip._id,
				ElectricityEqType: specificType,
				UsageHistory: {},
			});
			res.status(201).json({ status: "success" });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "An error occurred while add new device",
			});
		}
	}

	async deleteAllEquipments(req, res, next) {
		try {
			const equipments = await equipment.deleteMany({});
			if (!equipments || equipments.deletedCount === 0) {
				return res
					.status(404)
					.json({ error: "No electricity equipments found" });
			}
			res.json({
				message: `${equipments.deletedCount} electricity equipments deleted successfully`,
			});
		} catch (error) {
			console.error("Error deleting electricity equipments:", error);
			res.status(500).json({
				error: "An error occurred while deleting the electricity equipments",
			});
		}
	}

	async index_modify(req, res, next) {
		const dev = (await device.findById(req.params.id)).toObject();
        const equip = (await equipment.findOne({DeviceID: req.params.id})).toObject();
        // console.log(sen)
                res.render('user/equipment_modify', {
                    layout: 'main',
                    device: dev,
                    equipment:equip
                })  
	}

	async equipment_modify(req, res, next) {
		const data = req.body;
		const dev = await device.findByIdAndUpdate(req.params.id, data);
		const state = data.State;
		var equipdata={
			State: state,
			Timer:{
				isTimer : data.isTimer,
				TimeTurnOn : data.TimeTurnOn,
				TimeTurnOff : data.TimeTurnOff
			}
		} 
		const equip = await equipment.findOneAndUpdate({DeviceID : req.params.id},equipdata);
		console.log(state);
		if (state == "true") {
			const data = {
				value: ValueTable[equip.ElectricityEqType]
			}
			await axios.post(
				`${baseUrl}/feeds/${dev.AdaID}/data`, data, {
				}
			)
		} else {
			const data = {
				value: '0'
			}
			await axios.post(
				`${baseUrl}/feeds/${dev.AdaID}/data`, data, {
				}
			)
		}
		res.redirect("/equipment");
	}
}

module.exports = new EquipmentController();
