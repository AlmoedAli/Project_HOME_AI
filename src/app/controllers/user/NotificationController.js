const notification = require("../../models/notification");
const device = require("../../models/device");
const sensor = require("../../models/sensor");
const equipment = require("../../models/equipment");
const { ObjectId } = require('mongodb');

class NotificationController {
    async index(req, res, next) {
        const notificationsOb = await notification.find();
        const notifications = await Promise.all(notificationsOb.map(async (noti) => {
            let detail;
            if (noti.Type == "sensor") {
                let temp = (await sensor.findOne({ DeviceID: noti.DeviceID })).toObject();
                detail = temp.SensorType;
            }
            else if (noti.Type == "electricity") {
                let temp = (await equipment.findOne({ DeviceID: noti.DeviceID })).toObject();
                detail = temp.ElectricityEqType;
            }
            return {
                _id: noti._id,
                type: noti.Type,
                time: noti.Time,
                seen: noti.Seen,
                value: noti.Value,
                detail: detail
            };
        }));
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

    async notification_modify(req, res, next) {
        await notification.findOneAndUpdate({_id: req.params.id}, {$set: {Seen: true}});
		res.redirect("/notification")
	}

    async delete_notification(req, res, next) {
        await notification.findOneAndDelete({ _id: req.params.id });
		res.redirect("/notification")
	}
}

module.exports = new NotificationController();