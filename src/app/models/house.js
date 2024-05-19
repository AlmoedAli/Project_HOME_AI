const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const HouseSchema = new mongoose.Schema(
    {
        UserID: {type: ObjectId, ref: 'User'},
        Name: {type: String, required: true},
        Address: {type: String, required: true},
    },
    {collection: 'house'}
) 

module.exports = mongoose.model('House', HouseSchema);