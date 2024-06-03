const mongoose = require('mongoose');

const MiniProductSchema = new mongoose.Schema({
    categoryName: {
        type: String
    },
    productName: {
        type: String
    },
    productImages:[String],
    price: {
        type: Number
    },
    quantity: {
        type: String
    },
    sku:{ type:String },
})

const orderSchema = new mongoose.Schema({
    items: [MiniProduct],
    FinalPrice: {
        type: String
    },
    UserInfo: {
        Name: {
            type: String
        },
        Email: {
            type: String
        },
        PhoneNumber:{
            type: String
        },
        userid: {
            type: String
        }
    },
    UserDeliveryAddress:{
        Street:{type:String},
        HouseNo:{type:String},
        Pincode:{type:String},
        State:{type:String},
        City:{type:String},
        landMark:{type:String}
    },
    Transaction_id: {
        type: String
    },
    OrderStatus: {
        type: String,
        default: "pending"
    },
    PaymentMode: {
        type: String,
        default: "Online"
    },
    PaymentStatus: {
        type: String,
        default: "Complete"
    },
    OrderDate: {
        type: Date,
        default: Date.now()
    }

}, { timestamps: true })

module.exports = mongoose.model('OrderDetails',orderSchema);
