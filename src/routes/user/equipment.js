const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/session");
const equipmentController = require("../../app/controllers/user/EquipmentController");

router.get("/", isAuthenticated, equipmentController.index);
router.get("/:id", isAuthenticated, equipmentController.getEquipment);
router.get("/:id/edit", isAuthenticated, equipmentController.index_modify);
router.post("/:id/edit", isAuthenticated, equipmentController.equipment_modify);
router.delete("/delete", isAuthenticated, equipmentController.deleteAllEquipments);

module.exports = router;
    