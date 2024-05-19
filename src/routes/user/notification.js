const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const notificationController = require("../../app/controllers/user/NotificationController");

router.get("/", isAuthenticated, notificationController.index);
router.get("/:id", isAuthenticated, notificationController.getNotification);
router.post("/:id", isAuthenticated, notificationController.notification_modify);
router.delete("/:id", isAuthenticated, notificationController.delete_notification);

module.exports = router;
