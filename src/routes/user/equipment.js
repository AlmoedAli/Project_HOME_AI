const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/session');
const equipmentController = require('../../app/controllers/user/EquipmentController')

router.get('/', equipmentController.index);
router.post('/add', equipmentController.addNewEquipment);
router.delete('/delete', equipmentController.deleteAllEquipments);

module.exports = router;