const notification = require("../../models/notification");
const device = require("../../models/device");
const { ObjectId } = require('mongodb');

class NotificationController {
    index(req, res, next) {
        res.render("user/notification", {
            layout: "main",
        });
	}
}

module.exports = new NotificationController();