const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const DeviceSchema = new mongoose.Schema(
    {
        Name: {type: String, required: true},
        Location: {type: String, required: true},
        Type: {type: String, required: true},
        HouseID: {type: ObjectId, ref: 'House'},
        AdaID: Number
    },
    {collection: 'device'}
) 

module.exports = mongoose.model('Device', DeviceSchema);