const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const SensorSchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, required: true},
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