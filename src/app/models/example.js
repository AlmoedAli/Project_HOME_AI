const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ExampleSchema = new mongoose.Schema(
    {
        example: {type: String}
    },
    {collection: 'example'}
) 

module.exports = mongoose.model('Example', ExampleSchema);