const mongoose = require('mongoose');

const SalesBannerSchema = new mongoose.Schema({
    saleBannerTitle :{
        type:String,
        required:true
    },
    saleBannerImage: { type: String, required: true },
    active: { type: Boolean, default:true },
}, { timestamps : true })

module.exports = mongoose.model('SalesBannerDetails',SalesBannerSchema);