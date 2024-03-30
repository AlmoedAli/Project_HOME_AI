const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const EquipmentSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        ElectricityEqType: {type: String, required: true},
        UsageHistory: {
            UsageStartTime: {type: Date},
            UsageEndTime: {type: Date},
        }
        // PowerConsumped: {type: Number, required: true},
    },
    {collection: 'equipment'}
) 

module.exports = mongoose.model('Equipment', EquipmentSchema);