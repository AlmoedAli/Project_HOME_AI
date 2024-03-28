const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/session');

const homepageController = require('../../app/controllers/user/HomePageController')

router.get('/', homepageController.index);

module.exports = router;