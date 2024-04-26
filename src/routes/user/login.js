const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const LoginController = require("../../app/controllers/user/LoginController");

router.get("/", LoginController.login);
router.post("/", LoginController.login_check);

module.exports = router;
