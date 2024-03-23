const equipment = require('../../models/equipment');
const electricity_equipment = require('../../models/electricity_equipment');
const sensor = require('../../models/sensor');

class EquipmentController {
    index(req, res, next) {
        equipment.find()
            .then(equipmentsOb => {
                const equipments = equipmentsOb.map(equipment => {
                    return {
                        _id: equipment._id,
                        name: equipment.Name,
                        location: equipment.Location,
                        type: equipment.Type,
                        state: equipment.State,
                        installationDate: equipment.InstallationDate,
                        powerConsumption: equipment.PowerConsumption,
                    }
                })
                res.render('user/equipment', {
                    layout: 'main',
                    equipments: equipments
                })
            })
            .catch(next);
    }

    async addNewEquipment(req, res, next) {
        const { name, location, type, specificType, powerconsumption } = req.body;
        const state = true;
        const installationDate = new Date("2024-03-22");

        try {
            const newEquip = await equipment.create({
                Name: name, 
                Location: location, 
                Type: type,
                State: state,
                InstallationDate: installationDate,
                PowerConsumption: parseFloat(powerconsumption)
            });
            if (type == 'electricity')
            {
                await electricity_equipment.create({
                    EquipmentID: newEquip._id,
                    ElectricityEqType: specificType,
                    UsageHistory: {},
                })
            }
            else 
            {
                await sensor.create({
                    EquipmentID: newEquip._id,
                    SensorType: specificType,
                    ReadingHistory: {},
                })
            }
            res.status(201).json({ status: 'success'});
        } 
        catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while add new equipment' });
        }
    };

    async deleteAllEquipments(req, res, next) {
        try {
            const equipmentDeleteResult = await equipment.deleteMany({});
            const electricityDeleteResult = await electricity_equipment.deleteMany({});
            const sensorDeleteResult = await sensor.deleteMany({});
            
            const electricityDeleteCount = electricityDeleteResult.deletedCount
            const sensorDeleteCount = sensorDeleteResult.deletedCount;
            
            if (electricityDeleteCount + sensorDeleteCount === 0) {
                return res.status(404).json({ error: 'No equipments found' });
            }
            
            res.json({ message: `${electricityDeleteCount} electricity equipments and ${sensorDeleteCount}deleted successfully` });
        } 
        catch (error) {
            console.error('Error deleting equipments:', error);
            res.status(500).json({ error: 'An error occurred while deleting the equipments' });
        }
    };
}

module.exports = new EquipmentController;