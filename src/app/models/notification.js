const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const NotificationSchema = new mongoose.Schema(
    {
        Type: {type: String, required: true},
        Time: {type: Date, required: true},
    },
    {collection: 'notification'}
) 

module.exports = mongoose.model('Notification', NotificationSchema);