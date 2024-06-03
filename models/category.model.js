const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true,"Please Fill Category Name"]
    },
    categoryImage:{
        type:String,
        required:[true,"Add Image"]
    },
    categoryActive:{
        type:Boolean
    }
})

const categoryDetail = mongoose.model('categoryDetail',categorySchema);
module.exports = categoryDetail;