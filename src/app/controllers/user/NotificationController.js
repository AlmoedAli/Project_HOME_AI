const notification = require("../../models/notification");
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
}

module.exports = new NotificationController();