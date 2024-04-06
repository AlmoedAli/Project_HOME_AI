if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const device  = require('../../app/models/device');
const equipment = require('../../app/models/equipment');
const sensor = require('../../app/models/sensor');
const readinghistory  = require('../../app/models/readinghistory');
const usagehistory = require('../../app/models/usagehistory');

const axios = require('axios');

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

const baseUrl = `https://io.adafruit.com/api/v2/${AIO_USERNAME}`
axios.defaults.headers.common['X-AIO-Key'] = AIO_KEY;

const dataLimit = 20;

const NameTable = Object.freeze({
    CONTROL_SPEED_FAN_FEED: "Quạt",
    LED_BUTTON_FEED: "Đèn",
    PUMP_BUTTON_FEED: "Cửa",
    HUMIDITY_FEED: "Độ ẩm",
    LIGHT_FEED: "Ánh sáng",
    TEMPERATURE_FEED: "Nhiệt độ"
});

const UnitTable = Object.freeze({
    TEMPERATURE_FEED: "℃",
    HUMIDITY_FEED: "%",
    LIGHT_FEED: "lx"
});

const EQUIPMENTS = ["CONTROL_SPEED_FAN_FEED", "LED_BUTTON_FEED", "PUMP_BUTTON_FEED"];
const SENSORS = ["HUMIDITY_FEED", "LIGHT_FEED", "TEMPERATURE_FEED"];

async function getData() {
    const allFeeds = (await fetch(`${baseUrl}/groups?x-aio-key=${AIO_KEY}`).then((res) => res.json()))[0].feeds;
    allFeeds.forEach(async feed => {
        if (!NameTable[feed.name]) return;
        const dev = await device.findOne({AdaID: feed.id});
        if (dev) return;
        if (EQUIPMENTS.includes(feed.name)) {
            const newEquip = await device.create({
				Name: NameTable[feed.name],
				Location: "Phòng khách",
				Type: "electricity",
                AdaID: feed.id
			});
			await equipment.create({
				DeviceID: newEquip._id,
				ElectricityEqType: NameTable[feed.name],
                State: false,
			});
        } else if (SENSORS.includes(feed.name)) {
            const newSensor = await device.create({
				Name: NameTable[feed.name],
				Location: "Phòng khách",
				Type: "sensor",
                AdaID: feed.id,
			});
			await sensor.create({
				DeviceID: newSensor._id,
				SensorType: NameTable[feed.name],
                Unit: UnitTable[feed.name]
			});
        }
    });
    const devices = await device.find();
    devices.map(device => {
        axios.get(
            `${baseUrl}/feeds/${device.AdaID}/data?limit=${dataLimit}`, {
            }
        )
        .then(async response => {
            const resData = response.data;
            console.log(resData); 
            if (device.Type == "sensor") {
                var hists = await readinghistory.find({DeviceID: device._id});
                const inDbData = new Set(hists.map(data => data.DataID));
                if (resData.length > 0) {
                    for (const eachData of resData) {
                        const { id, value, created_at } = eachData;
                        if (!inDbData.has(id)) {
                            const newData = new readinghistory({ 
                                DeviceID: device._id,
                                DataID: id, 
                                ReadingValue: value, 
                                ReadingDateTime: created_at 
                            });
                            hists.unshift(newData);
                            inDbData.add(id);
                        }
                    }
                }
                if (hists.length > dataLimit) {
                    hists = hists.slice(0, dataLimit);
                }
                await Promise.all(hists.map(hist => hist.save()));
            } else if (device.Type == "electricity") {
                // var hists = await usagehistory.find({DeviceID: device._id});
                // const inDbData = new Set(hists.map(data => data.DataID));
                // if (resData.length > 0) {
                //     for (const eachData of resData) {
                //         const { id, value, created_at } = eachData;
                //         if (!inDbData.has(id)) {
                //             const newData = new usagehistory({ 
                //                 DeviceID: device._id,
                //                 DataID: id, 
                //                 UsageStartTime: created_at ,
                //                 UsageEndTime: 1
                //             });
                //             hists.unshift(newData);
                //             inDbData.add(id);
                //         }
                //     }
                // }
                // if (hists.length > dataLimit) {
                //     hists = hists.slice(0, dataLimit);
                // }
                // await Promise.all(hists.map(hist => hist.save()));
            }
        })
        .catch(err => {console.log(err);});
    })
}

function getDataInterval() {
    setInterval(() => {
        getData()
        .then(() => {

        })
    }, 5000);
}

module.exports = { getDataInterval };