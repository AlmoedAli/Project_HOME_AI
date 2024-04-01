const equipment = require("../../models/equipment");
const device = require("../../models/device");

class EquipmentController {
	async getEquipments(req, res, next) {
		let devices;
		try {
			devices = await device.find({ Type: "electricity" });
		} catch (error) {
			next(error);
		}

		const equipments = devices.map((device) => {
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

		res.render("equipment/equipments", {
			layout: "main",
			equipments: equipments,
			"equipment-active": true,
			selections: [{ value: "Tên thiết bị" }, { value: "Loại thiết bị" }],
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
						type: device.Type,
						state: device.State,
						installationDate: device.InstallationDate,
						powerConsumption: device.PowerConsumption,
					};
				});
				res.render("user/equipment", {
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

	index_modify(req, res, next) {
		equipment
			.find()
			.then((equipmentsOb) => {
				const equipments = equipmentsOb.map((equipment) => {
					return {
						_id: equipment._id,
						name: equipment.Name,
						location: equipment.Location,
						type: equipment.Type,
						state: equipment.State,
						installationDate: equipment.InstallationDate,
						powerConsumption: equipment.PowerConsumption,
					};
				});
				res.render("user/equipment_modify", {
					layout: "main",
					equipments: equipments,
				});
			})
			.catch(next);
	}

	async modifyEquipment(req, res, next) {
		try {
			const result = await User.updateOne(
				{ _id: userId },
				{ age: newAge }
			);
		} catch (error) {
			console.error("Error modifying equipments:", error);
			res.status(500).json({
				error: "An error occurred while modifying the equipments",
			});
		}
	}
}

module.exports = new EquipmentController();
