const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    bannerImage:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    }
}, { timestamps : true });

module.exports = mongoose.model("BannerDetails",BannerSchema);
