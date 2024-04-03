const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { DeviceSchema } = require('./device');

const SensorSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        SensorType: {type: String, required: true},
        Errors: {type: Number},
        SafetyRange: {
            UpperBound: {type: Number},
            LowerBound: {type: Number},
        },
        ReadingHistory: {
            RecordID: {type: Number},
            ReadingDateTime: {type: Date},
            ReadingValue: {type: Number},
        }
    },
    {collection: 'sensor'}
) 

module.exports = mongoose.model('Sensor', SensorSchema);