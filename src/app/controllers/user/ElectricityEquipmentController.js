const electricity_equipment = require('../../models/electricity_equipment');

class ElectricityEquipmentController {
    
    async deleteAllElectricityEquipments(req, res, next) {
        try {
            const electricity_equipments = await electricity_equipment.deleteMany({});
            if (!electricity_equipments || electricity_equipments.deletedCount === 0) {
                return res.status(404).json({ error: 'No electricity equipments found' });
            }
            res.json({ message: `${electricity_equipments.deletedCount} electricity equipments deleted successfully` });
        } 
        catch (error) {
            console.error('Error deleting electricity equipments:', error);
            res.status(500).json({ error: 'An error occurred while deleting the electricity equipments' });
        }
    };
}

module.exports = new ElectricityEquipmentController;