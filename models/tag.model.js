const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Ensure title is required
    },
    TagColour: {
        type: String,
        required: true // Ensure title is required
    },
}, { timeStamps: true })

module.exports = mongoose.model('TagsDetails',TagsSchema);