const equipment = require("../../models/equipment");
const device = require("../../models/device");
const { ObjectId } = require('mongodb');
const usagehistory = require("../../models/usagehistory");

class EquipmentController {
	async getEquipment(req, res, next) {
		// let devices;
		// try {
		// 	devices = await device.find({ Type: "electricity" });
		// } catch (error) {
		// 	next(error);
		// }

		
		const dev = (await device.findById(req.params.id)).toObject();
        // console.log(dev)
        const equip = (await equipment.findOne({DeviceID: req.params.id})).toObject();
        // const histories = (await usagehistory.findOne({DeviceID: req.params.id} ,{},{ sort: { 'ReadingDateTime':-1} })).toObject();
        // console.log(histories)
        res.render("user/equipment_detail", {
            layout: "main", 
            device: dev, 
            equipment: equip,
            // history: histories
        });
	}

	index(req, res, next) {
		device
			.find({ Type: "electricity" })
			.then((devicesOb) => {
				const devices = devicesOb.map((device) => {
					return {
						_id: device._id,
						name: device.Name,
						location: device.Location,
						type: device.Type
					};
				});
				res.render("user/equipments", {
					layout: "main",
					equipments: devices,
				});
			})
			.catch(next);
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
		
        console.log(dev)
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
		await device.findByIdAndUpdate(req.params.id, data);

		var equipdata={
			State: data.State,
			Timer:{
				isTimer : data.isTimer,
				TimeTurnOn : data.TimeTurnOn,
				TimeTurnOff : data.TimeTurnOff
			}
		} 
		await equipment.findOneAndUpdate({DeviceID : req.params.id},equipdata)
		res.redirect("/equipment")
	}
}

module.exports = new EquipmentController();
