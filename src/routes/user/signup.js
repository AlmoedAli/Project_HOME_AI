const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const SignUpController = require("../../app/controllers/user/SignUpController");

router.get("/", SignUpController.signup);
router.post("/", SignUpController.signup_check);
module.exports = router;
