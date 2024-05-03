const notification = require("../../models/notification");
const device = require("../../models/device");
const sensor = require("../../models/sensor");
const equipment = require("../../models/equipment");
const { ObjectId } = require('mongodb');

class NotificationController {
    async index(req, res, next) {
        const notificationsOb = await notification.find();
        const notifications = notificationsOb.map(notification => {
            return {
                _id: notification._id,
                type: notification.Type,
                time: notification.Time,
            };
        });
        res.render('user/notification', {
            layout: 'main',
            notifications: notifications
        })
    }

    async getNotification(req, res, next) {
		try {
			const noti = (await notification.findById(req.params.id)).toObject();
            const dev = (await device.findById(noti.DeviceID)).toObject();
            const sen = await sensor.findOne({DeviceID: noti.DeviceID});
            const equip = await equipment.findOne({DeviceID: noti.DeviceID});
            let result;
            if (sen === null) {
                result = await(equip.toObject());
                res.render("user/notification_detail_equipment", {
                    layout: "main",
                    noti: noti,
                    dev: dev,
                    detail: result,
                });
            }
            else {
                result = await(sen.toObject());
                res.render("user/notification_detail_sensor", {
                    layout: "main",
                    noti: noti,
                    dev: dev,
                    detail: result,
                });
            }

		} catch (error) {
			next(error);
		}
	}
}

module.exports = new NotificationController();