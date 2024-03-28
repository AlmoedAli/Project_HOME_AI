const equipment = require('../../models/equipment');
const device = require('../../models/device');

class EquipmentController {
    index(req, res, next) {
        device.find({ Type: 'electricity' })
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
                res.render('user/equipment', {
                    layout: 'main',
                    equipments: devices
                })
            })
            .catch(next);
    }

    async addNewEquipment(req, res, next) {
        const { name, location, type, specificType, powerconsumption } = req.body;
        const state = true;
        const installationDate = new Date("2024-03-22");

        try {
            const newEquip = await device.create({
                Name: name, 
                Location: location, 
                Type: type,
                State: state,
                InstallationDate: installationDate,
                PowerConsumption: parseFloat(powerconsumption)
            });
            await equipment.create({
                DeviceID: newEquip._id,
                ElectricityEqType: specificType,
                UsageHistory: {},
            });
            res.status(201).json({ status: 'success'});
        } 
        catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while add new device' });
        }
    };

    async deleteAllEquipments(req, res, next) {
        try {
            const equipments = await equipment.deleteMany({});
            if (!equipments || equipments.deletedCount === 0) {
                return res.status(404).json({ error: 'No electricity equipments found' });
            }
            res.json({ message: `${equipments.deletedCount} electricity equipments deleted successfully` });
        } 
        catch (error) {
            console.error('Error deleting electricity equipments:', error);
            res.status(500).json({ error: 'An error occurred while deleting the electricity equipments' });
        }
    };
}

module.exports = new EquipmentController;