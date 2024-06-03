const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, "Please Select Category Name"]
    },
    productName: {
        type: String,
        required: [true, "Add Product Name"]
    },
    productDescription: {
        type: String,
        required: [true, "Add Product Description"]
    },
    productPoints: {
        type: [String]
    },
    productImages:[String],
    price: {
        type: Number,
        required: [true, "Add Product Price"]
    },
    discountPrice: {
        type: Number,
        required: [true, "Add Discount Price"]
    },
    discountPercentage: {
        type:Number
    },
    tag: {
        type: String
    },
    sku:{ type:String },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Add Quantity"]
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductDetails', productSchema);
