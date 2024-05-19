const homepage = require('../../models/homepage');
const notification = require("../../models/notification");

class HomePageController {
    async index(req, res, next) {
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
            notifications: notifications
        })
    }
}

module.exports = new HomePageController;