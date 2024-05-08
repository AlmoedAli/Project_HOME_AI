const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const NotificationSchema = new mongoose.Schema(
    {
        Type: {type: String, required: true},
        Time: {type: Date, required: true},
        Value: {type: Number, required: true},
        DeviceID: {type: ObjectId, ref: 'Device'},
    },
    {collection: 'notification'}
) 

module.exports = mongoose.model('Notification', NotificationSchema);