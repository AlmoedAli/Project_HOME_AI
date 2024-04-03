const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const UsageHistorySchema = new mongoose.Schema(
    {
        DeviceID: {type: ObjectId, ref: 'Device'},
        UsageStartTime: {type: Date},
        UsageEndTime: {type: Date}
    },
    {collection: 'usagehistory'}
) 

module.exports = mongoose.model('UsageHistory', UsageHistorySchema);