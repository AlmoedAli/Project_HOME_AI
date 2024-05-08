const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const notificationController = require("../../app/controllers/user/NotificationController");

router.get("/", notificationController.index);
router.get("/:id", notificationController.getNotification);
router.post("/:id", notificationController.notification_modify);
router.delete("/:id", notificationController.delete_notification);
module.exports = router;
