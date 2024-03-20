const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/session');

const exampleController = require('../../app/controllers/user/ExampleController')

router.get('/', exampleController.index);

module.exports = router;