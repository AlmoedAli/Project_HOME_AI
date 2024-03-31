const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const HomePageSchema = new mongoose.Schema(
    {
        homepage: {type: String}
    },
    {collection: 'homepage'}
) 

module.exports = mongoose.model('HomePage', HomePageSchema);