const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const notificationController = require("../../app/controllers/user/NotificationController");

router.get("/", isAuthenticated, notificationController.index);
router.get("/:id", isAuthenticated, notificationController.getNotification);
// router.get("/:id/edit", notificationController.index_modify);
// router.post("/:id/edit", notificationController.notification_modify);
// router.delete("/delete", notificationController.deleteAllNotifications);
module.exports = router;
