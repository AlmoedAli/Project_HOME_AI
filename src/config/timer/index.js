if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const schedule = require('node-schedule');

const equipment = require('../../app/models/equipment');
const device = require('../../app/models/device');
const changeStream = equipment.watch();

const axios = require('axios');

axios.defaults.headers.common['X-AIO-Key'] = process.env.AIO_KEY;
const baseUrl = `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}`;

const ValueTable = Object.freeze({
    "Quạt": "40",
    "Đèn": "1",
    "Cửa": "1",
});

async function triggerDeviceOn(equip, adaId) {
    const data = {
        value: ValueTable[equip.ElectricityEqType]
    }
    await axios.post(
        `${baseUrl}/feeds/${adaId}/data`, data, {
    }
    )
    equip.State = true;
    await equip.save();
}

async function triggerDeviceOff(equip, adaId) {
    const data = {
        value: "0"
    }
    await axios.post(
        `${baseUrl}/feeds/${adaId}/data`, data, {
    }
    )
    equip.State = false;
    await equip.save();
}

const tracker = {}

async function init() {
    const equipments = await equipment.find();
    const promises = equipments.map(async (equip) => {
        const dev = await device.findOne({ _id: equip.DeviceID });
        if (equip.Timer.isTimer) {
            tracker[dev.AdaID] = {
                TimerTurnOn: schedule.scheduleJob(new Date(equip.Timer.TimeTurnOn), () => {
                    triggerDeviceOn(equip, dev.AdaID)
                }),
                TimerTurnOff: schedule.scheduleJob(new Date(equip.Timer.TimeTurnOff), () => {
                    triggerDeviceOff(equip, dev.AdaID)
                })
            }
        }
        else {
            tracker[dev.AdaID] = {
                TimerTurnOn: null,
                TimerTurnOff: null
            }
        }
    });
    await Promise.all(promises);
}

function watcher() {
    init()
        .then(() => {
            changeStream.on('change', async function (change) {
                const timerHolder = change.updateDescription.updatedFields.Timer;
                if (timerHolder) {
                    const equip = await equipment.findById(change.documentKey._id);
                    const dev = await device.findOne({ _id: equip.DeviceID });
                    if (timerHolder.isTimer) {
                        tracker[dev.AdaID].TimerTurnOn = schedule.scheduleJob(new Date(equip.Timer.TimeTurnOn), () => {
                            triggerDeviceOn(equip, dev.AdaID)
                        });
                        tracker[dev.AdaID].TimerTurnOff = schedule.scheduleJob(new Date(equip.Timer.TimeTurnOff), () => {
                            triggerDeviceOff(equip, dev.AdaID)
                        });
                    }
                    else {
                        if (tracker[dev.AdaID].TimerTurnOn) {
                            tracker[dev.AdaID].TimerTurnOn.cancel();
                        }
                        if (tracker[dev.AdaID].TimerTurnOff) {
                            tracker[dev.AdaID].TimerTurnOff.cancel();
                        }
                    }
                }

            })
        });

}

module.exports = { watcher };