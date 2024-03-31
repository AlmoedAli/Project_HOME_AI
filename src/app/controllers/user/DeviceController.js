const device = require('../../models/device');
const equipment = require('../../models/equipment');
const sensor = require('../../models/sensor');

class DeviceController {
    index(req, res, next) {
        device.find()
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
                res.render('user/device', {
                    layout: 'main',
                    devices: devices
                })
            })
            .catch(next);
    }

    async addNewDevice(req, res, next) {
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
            if (type == 'electricity')
            {
                await equipment.create({
                    DeviceID: newEquip._id,
                    ElectricityEqType: specificType,
                    UsageHistory: {},
                })
            }
            else 
            {
                await sensor.create({
                    DeviceID: newEquip._id,
                    SensorType: specificType,
                    ReadingHistory: {},
                })
            }
            res.status(201).json({ status: 'success'});
        } 
        catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while add new device' });
        }
    };

    async deleteAllDevices(req, res, next) {
        try {
            const deviceDeleteResult = await device.deleteMany({});
            const electricityDeleteResult = await equipment.deleteMany({});
            const sensorDeleteResult = await sensor.deleteMany({});
            
            const electricityDeleteCount = electricityDeleteResult.deletedCount
            const sensorDeleteCount = sensorDeleteResult.deletedCount;
            
            if (electricityDeleteCount + sensorDeleteCount === 0) {
                return res.status(404).json({ error: 'No devices found' });
            }
            
            res.json({ message: `${electricityDeleteCount} electricity devices and ${sensorDeleteCount}deleted successfully` });
        } 
        catch (error) {
            console.error('Error deleting devices:', error);
            res.status(500).json({ error: 'An error occurred while deleting the devices' });
        }
    };
}

module.exports = new DeviceController;