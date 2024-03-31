const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { DeviceSchema } = require('./device');

const SensorSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        SensorType: {type: String, required: true},
        ReadingHistory: {
            ReadingDateTime: {type: Date},
            ReadingValue: {type: Number},
        }
        // PowerConsumped: {type: Number, required: true},
    },
    {collection: 'sensor'}
) 

module.exports = mongoose.model('Sensor', SensorSchema);