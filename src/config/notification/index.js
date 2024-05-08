if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const device  = require('../../app/models/device');
const equipment = require('../../app/models/equipment');
const sensor = require('../../app/models/sensor');
const notification  = require('../../app/models/notification');

const mqtt = require('mqtt');

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

const baseUrl = `${AIO_USERNAME}/feeds/`;

const TIME_LIMIT = 1800000;

const mqttOptions = {
    username: AIO_USERNAME,
    password: AIO_KEY
};


const client = mqtt.connect('mqtt://io.adafruit.com', mqttOptions);
client.setMaxListeners(15);
function watcher() {
    client.on('connect', async function () {
        console.log('Connected to Adafruit MQTT broker');
        const devices = await device.find();
        devices.map(device => {
            client_name = `${baseUrl}${device.AdaID}`
            client.subscribe(client_name);
        });
    });

    client.on('message', async function (topic, message) {
        const value = JSON.parse(message.toString());
        const adaID = parseInt(topic.toString().replace(baseUrl, ''));
        const dev = await device.findOne({ AdaID: adaID})
        const notifi = (await notification.find({ DeviceID: dev._id }).sort({"Time" : -1}))[0];
        const sens = (await sensor.find({ DeviceID: dev._id }))[0];
        if (sens != null)
        {
            if (value < sens.SafetyRange.LowerBound || value > sens.SafetyRange.UpperBound) {
                if (notifi != null) {
                    if (Date.now() - new Date(notifi.Time) > TIME_LIMIT) {
                        const newData = new notification({
                            Type: dev.Type,
                            Time: Date.now(),
                            Value: value,
                            DeviceID: dev._id
                        });
                        newData.save();
                    }
                } else {
                    const newData = new notification({
                        Type: dev.Type,
                        Time: Date.now(),
                        Value: value,
                        DeviceID: dev._id
                    });
                    newData.save();
                }
            }
        }

    });
}

module.exports = { watcher };
