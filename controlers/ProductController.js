const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const ProductDetails = require("../models/product.model");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 4);

cloudinary.config({
    cloud_name: "dohzhn0ny",
    api_key: "899193287131934",
    api_secret: "RN9ldy9uHfeWDTqWRPOX2-cvgMg"
});

const uploadImg = async (fileBuffer) => {
    try {
        const result = await cloudinary.uploader.upload_stream({
            resource_type: 'image',
            folder: 'products' // Optional: specify folder in Cloudinary
        }).end(fileBuffer);
        return result.secure_url;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to upload image');
    }
};

exports.createProduct = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: "File upload failed",
                    details: err.message
                });
            }

            // Check if files were uploaded
            const files = req.files;
            console.log(files)
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "No files uploaded"
                });
            }

            // Check for empty fields in req.body
            const { categoryName, productName, productDescription, productPoints, price, discountPrice, discountPercentage, tag, sku, inStock, stockQuantity } = req.body;
            const emptyFields = [];

            if (!categoryName) emptyFields.push('categoryName');
            if (!productName) emptyFields.push('productName');
            if (!productDescription) emptyFields.push('productDescription');
            if (!price) emptyFields.push('price');
            if (!discountPrice) emptyFields.push('discountPrice');
            if (!stockQuantity) emptyFields.push('stockQuantity');

            if (emptyFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: "Please provide all required fields",
                    missingFields: emptyFields
                });
            }

            // Upload images to Cloudinary
            const uploadedImages = [];
            try {
                for (let index = 0; index < files.length; index++) {
                    const file = files[index];

                    // Upload the file buffer to Cloudinary
                    const url = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        });
                        stream.end(file.buffer);
                    });

                    // Push the secure URL of the uploaded image to the array
                    console.log(url);
                    uploadedImages.push(url);
                }
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    error: "Image upload failed",
                    details: uploadError.message
                });
            }

            // Create a new product instance
            const newProduct = new ProductDetails({
                categoryName,
                firstImage: uploadedImages[0] || null,
                productName,
                productDescription,
                price,
                discountPrice,
                discountPercentage,
                tag,
                sku,
                inStock,
                stockQuantity,
                productPoints,
                secondImage: uploadedImages[1] || null,
                thirdImage: uploadedImages[2] || null,
                forthImage: uploadedImages[3] || null
            });

            // Save the new product to the database
            await newProduct.save();

            res.status(200).json({
                success: true,
                msg: "Product created successfully",
                data: newProduct
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            details: error.message
        });
    }
};

exports.getAllProduct = async (req,res) => {
    try {
        const getAllPro = await ProductDetails.find();
        if(getAllPro === 0){
            return res.status(400).json({
                success: false,
                msg: "product Not Avilable Now"
            })
        }
        res.status(201).json({
            success:true,
            data:getAllPro,
            msg: "All products Found"
        })
        
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.deleteProduct = async (req,res)=>{
    try {
        const id = req.params.id;
        const checkProduct = await ProductDetails.deleteOne({_id:id})
        if(!checkProduct){
            return res.status(403).json({
                success: false,
                msg: "Product Not Found"
            })
        }
        res.status(200).json({
            success:true,
            msg:"Product Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // console.log("Incoming-Products:", updateFields);

        // Update the product in the database
        const updatedProduct = await ProductDetails.findByIdAndUpdate(id, { $set: { ...updateFields } }, { new: true });

        console.log("Updated-Products:", updatedProduct);

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            msg:"Product Update Succesfully !!",
            data: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};



