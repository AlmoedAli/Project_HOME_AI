const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const LogoutController = require("../../app/controllers/user/LogoutController");

router.get("/", LogoutController.logout);

module.exports = router;
