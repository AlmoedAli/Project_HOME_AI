const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ReadingHistorySchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        ReadingDateTime: {type: Date},
        ReadingValue: {type: Number},
        DataID: {type: String, required: true}
    },
    {collection: 'readinghistory'}
) 

module.exports = mongoose.model('ReadingHistory', ReadingHistorySchema);