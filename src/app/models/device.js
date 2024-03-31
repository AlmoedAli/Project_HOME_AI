const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const DeviceSchema = new mongoose.Schema(
    {
        Name: {type: String, required: true},
        Location: {type: String, required: true},
        Type: {type: String, required: true},
        State: {type: Boolean, required: true},
        InstallationDate: {type: Date, required: true},
        PowerConsumption: {type: Number, required: true},
    },
    {collection: 'device'}
) 

module.exports = mongoose.model('Device', DeviceSchema);