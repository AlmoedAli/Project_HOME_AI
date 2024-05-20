const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const profileController = require("../../app/controllers/user/ProfileController");

router.get("/", isAuthenticated, profileController.index);
module.exports = router;
