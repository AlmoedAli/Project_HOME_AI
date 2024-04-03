const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { DeviceSchema } = require('./device');

const EquipmentSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        ElectricityEqType: {type: String, required: true},
        State: {type: Boolean, required: true},
        Timer: {
            isTimer: {type: Boolean},
            TimeTurnOn: {type: Date},
            TimeTurnOff: {type: Date},
        },
        UsageHistory: {
            UsageID: {type: Number},
            UsageStartTime: {type: Date},
            UsageEndTime: {type: Date},
        }
    },
    {collection: 'equipment'}
) 

module.exports = mongoose.model('Equipment', EquipmentSchema);