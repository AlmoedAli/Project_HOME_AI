const homepage = require('../../models/homepage');
const notification = require("../../models/notification");
const readingHistory = require("../../models/readinghistory");

class HomePageController {
    async index(req, res, next) {
        const temperatureReadingHistory = await readingHistory.find({ DeviceID: '663b423bc51e72e762327ec7' });
        var temperaturedata = [];
        temperatureReadingHistory.forEach(item => {
            if (item.ReadingDateTime == null || item.ReadingValue == null)
                return;
            const readingDateTime = new Date(item.ReadingDateTime);
            const readingValue = item.ReadingValue;
            const readingDate = readingDateTime.toLocaleDateString();
            temperaturedata.push({ date: readingDate, value: readingValue });
        });
        const temperaturelabels = JSON.stringify(temperaturedata.map(item => item.date));
        const temperaturedatas = JSON.stringify(temperaturedata.map(item => item.value));

        const humidityReadingHistory = await readingHistory.find({ DeviceID: '663b423bc51e72e762327ebd' });
        var humiditydata = [];
        humidityReadingHistory.forEach(item => {
            if (item.ReadingDateTime == null || item.ReadingValue == null)
                return;
            const readingDateTime = new Date(item.ReadingDateTime);
            const readingValue = item.ReadingValue;
            const readingDate = readingDateTime.toLocaleDateString();
            humiditydata.push({ date: readingDate, value: readingValue });
        });
        const humiditylabels = JSON.stringify(humiditydata.map(item => item.date));
        const humiditydatas = JSON.stringify(humiditydata.map(item => item.value));

        const lightReadingHistory = await readingHistory.find({ DeviceID: '663b423bc51e72e762327ec1' });
        var lightdata = [];
        lightReadingHistory.forEach(item => {
            if (item.ReadingDateTime == null || item.ReadingValue == null)
                return;
            const readingDateTime = new Date(item.ReadingDateTime);
            const readingValue = item.ReadingValue;
            const readingDate = readingDateTime.toLocaleDateString();
            lightdata.push({ date: readingDate, value: readingValue });
        });
        const lightlabels = JSON.stringify(lightdata.map(item => item.date));
        const lightdatas = JSON.stringify(lightdata.map(item => item.value));

        const notificationsOb = await notification.find();
        const notifications = notificationsOb.map(notification => {
            return {
                _id: notification._id,
                type: notification.Type,
                time: notification.Time,
                seen: notification.Seen,
            };
        });
        res.render('user/homepage', {
            layout: 'main',
            notifications: notifications,
            temperaturelabels: temperaturelabels,
            temperaturedatas: temperaturedatas,
            humiditylabels: humiditylabels,
            humiditydatas: humiditydatas,
            lightlabels: lightlabels,
            lightdatas: lightdatas,
        })
    }
}

module.exports = new HomePageController;