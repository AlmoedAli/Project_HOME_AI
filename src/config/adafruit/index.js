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

const TURN_OFF_UPPERBOUND = 3600000;

function calculateUsageTime(data) {
    let startTime = null;
    let endTime = null;
    let result = [];
    for (entry of data.reverse()) {
        const value = parseInt(entry.value);
        const createdAt = new Date(entry.created_at);
        
        if (value !== 0 && startTime === null) {
            startTime = createdAt;
        }

        if (startTime !== null && value !== 0) { 
            if (endTime !== null) {
                const timeDiff = createdAt - endTime;
                if (timeDiff > TURN_OFF_UPPERBOUND) {
                    result.push({ startTime, endTime});
                    startTime = createdAt;
                    endTime = null;
                } else {
                    endTime = createdAt;
                }
            } else {
                endTime = createdAt;
            }
        } else if (startTime !== null && value === 0) {
            endTime = createdAt;
            result.push({ startTime, endTime});
            startTime = null;
            endTime = null;
        }
    }
    result.push({startTime, endTime});
    return result;
}

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
                var lastUsedDev = await usagehistory.findOne({DeviceID: device._id}, {}, {sort: {"UsageEndTime": -1}});
                if (lastUsedDev) {
                    var lastUsed = new Date(lastUsedDev.UsageEndTime);
                    const lastAdaDate = resData.filter(data => new Date(data.created_at) >= lastUsed);
                    if (lastAdaDate.length > 0) {
                        var newDatas = calculateUsageTime(lastAdaDate);
                        if (lastUsed.getTime() === (new Date(newDatas[newDatas.length - 1].startTime)).getTime()) {
                            var lastNewData = newDatas.pop();
                            lastUsedDev.UsageEndTime = lastNewData.endTime
                            await lastUsedDev.save();
                        }
                        var hists = await usagehistory.find({ Device: device._id});
                        if (newDatas.length > 0) {
                            for (const entry of newDatas) {
                                const newData = new usagehistory({
                                    DeviceID: device._id,
                                    UsageStartTime: entry.startTime,
                                    UsageEndTime: entry.endTime,
                                })
                                hists.unshift(newData);
                            }
                        }
                        if (hists.length > dataLimit) {
                            hists = hists.slice(0, dataLimit);
                        }
                        await Promise.all(hists.map(hist => hist.save()));
                    }
                } else {
                    if (resData.length > 0) {
                        var usagesFromAda = calculateUsageTime(resData);
                        usagesFromAda.map(async usageFromAda => {
                            const newData = new usagehistory({
                                DeviceID: device._id,
                                UsageStartTime: usageFromAda.startTime,
                                UsageEndTime: usageFromAda.endTime,
                            });
                            await newData.save();
                        })
                    }
                    
                }
                
                // if (resData.length > 0) {
                //     for (const eachData of resData) {
                //         
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

function getDataInterval(interval) {
    setInterval(() => {
        var start = new Date().getTime();
        getData()
        .then(() => {
            var end = new Date().getTime();
            console.log(`Fetched time: ${end - start} ms`);
        })
        .catch(err => {console.log("Fatch error");});
    }, interval);
}

module.exports = { getDataInterval };