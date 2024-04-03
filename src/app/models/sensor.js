const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { DeviceSchema } = require('./device');

const SensorSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        SensorType: {type: String, required: true},
        Errors: {type: Number},
        Unit: {type: String, required: true},
        SafetyRange: {
            UpperBound: {type: Number},
            LowerBound: {type: Number},
        }
    },
    {collection: 'sensor'}
) 

module.exports = mongoose.model('Sensor', SensorSchema);