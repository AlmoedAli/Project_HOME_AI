const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const UserSchema = new mongoose.Schema(
    {
        cardID: {type: String},
        name: {type: String},
        password: {type: String},
        username: {type: String},
        isadmin: {type: Boolean}
    },
    {collection: 'user'}
) 

module.exports = mongoose.model('User', UserSchema);