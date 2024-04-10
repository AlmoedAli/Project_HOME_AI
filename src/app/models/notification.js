const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const NotificationSchema = new mongoose.Schema(
    {
        Name: {type: String, required: true},
    },
    {collection: 'notification'}
) 

module.exports = mongoose.model('Notification', NotificationSchema);