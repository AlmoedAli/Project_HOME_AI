const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const equipmentController = require("../../app/controllers/user/EquipmentController");

router.get("/", equipmentController.index);
router.get("/:id", equipmentController.getEquipment);
router.get("/:id/edit", equipmentController.index_modify);
router.post("/:id/edit", equipmentController.equipment_modify);
router.delete("/delete", equipmentController.deleteAllEquipments);
module.exports = router;
