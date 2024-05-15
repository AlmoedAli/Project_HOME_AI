const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const profileController = require("../../app/controllers/user/ProfileController");
const multer = require("multer");
const { randomBytes } = require("crypto");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "src/public/sounds/samples");
	},

	filename: function (req, file, cb) {
		const unique = randomBytes(16).toString("hex");
		cb(null, `${unique}_${file.originalname}`);
	},
});

// const upload = multer({
// 	dest: "src/public/sounds/samples",
// 	preservePath: true,
// });

const upload = multer({ storage: storage });

router.get("/", isAuthenticated, profileController.index);
router.post(
	"/voice",
	isAuthenticated,
	upload.single("voice"),
	profileController.addVoice
);
router.delete("/voice", isAuthenticated, profileController.removeVoice);
// router.get("/:id", notificationController.getNotification);
// router.post("/:id", notificationController.notification_modify);
// router.delete("/:id", notificationController.delete_notification);
module.exports = router;
