const equipment = require('../../models/equipment');

class EquipmentController {
    index(req, res, next) {
        res.render('user/equipment', {
            layout: 'main',
        })
    }

    async addNewEquipment(req, res, next) {
        // const { name, location, type, state, installationDate, powerConsumption } = req.body;
        const name = '1';
        const location = 'livingroom';
        const type = 'electronic';
        const state = true;
        const installationDate = Date.now;
        const powerConsumption = 1;
        try {
            const newEquipment = new equipment({ name, location, type, state, installationDate, powerConsumption });
            const savedNewEquipment = await newEquipment.save();
            res.status(201).json(savedNewEquipment);
        } 
        catch (error) {
            res.status(500).json({ error: 'An error occurred while add new equipment' });
        }
        Promise.all(promises)
            .then(() => res.redirect('equipment'))
            .catch(next);
    };

    async deleteAllEquipments(req, res, next) {
        try {
            const equipments = await equipment.deleteMany({});
            if (!equipments || equipments.deletedCount === 0) {
                return res.status(404).json({ error: 'No equipments found' });
            }
            res.json({ message: `${equipments.deletedCount} equipments deleted successfully` });
        } 
        catch (error) {
            console.error('Error deleting equipments:', error);
            res.status(500).json({ error: 'An error occurred while deleting the equipments' });
        }
        Promise.all(promises)
            .then(() => res.redirect('equipment'))
            .catch(next);
    };
}

module.exports = new EquipmentController;