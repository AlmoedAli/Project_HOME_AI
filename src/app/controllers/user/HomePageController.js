const homepage = require('../../models/homepage');
const sensor = require('../../models/sensor');
const equipment = require('../../models/equipment');
const device = require('../../models/device');

class HomePageController {
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
                res.render('user/homepage', {
                    layout: 'main',
                    devices: devices
                })
            })
            .catch(next);
    }
}

module.exports = new HomePageController;