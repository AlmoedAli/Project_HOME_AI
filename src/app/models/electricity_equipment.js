const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ElectricityEquipmentSchema = new mongoose.Schema(
    {
        EquipmentID: {type: ObjectId, required: true},
        ElectricityEqType: {type: String, required: true},
        UsageHistory: {
            UsageStartTime: {type: Date},
            UsageEndTime: {type: Date},
        }
        // PowerConsumped: {type: Number, required: true},
    },
    {collection: 'electricityEquipment'}
) 

module.exports = mongoose.model('ElectricityEquipment', ElectricityEquipmentSchema);