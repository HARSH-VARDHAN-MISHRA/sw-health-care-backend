const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    TagColour: {
        type: String
    },
}, { timeStamps: true })

module.exports = mongoose.model('TagsDetails',TagsSchema);