const cloudinary = require("cloudinary").v2;
const fs = require('fs').promises;
const path = require('path');

// Create Product 
exports.createProducts = async (req, res) => {
    try {
        // Check if files were uploaded
        const files = req.files;
        // console.log(files)

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No files uploaded"
            });
        }
        console.log(req.body)
        // console.log(parsedSizes)
        // Check for empty fields in req.body
        const { categoryName ,productName ,productDescription ,productPoints ,price ,discountPrice ,discountPercentage ,tag ,sku ,inStock ,stockQuantity } = req.body;
        const emptyFields = [];

        if (!productName) emptyFields.push('productName');
        // if (!discountPrice) emptyFields.push('discountPrice');
        // if (!mainPrice) emptyFields.push('mainPrice');
        if (!percentage) emptyFields.push('percentage');
        if (!collectionName) emptyFields.push('collectionName');
        if (!description) emptyFields.push('description');
        if (!SKU) emptyFields.push('SKU');
        if (!availability) emptyFields.push('availability');
        if (!categories) emptyFields.push('categories');

        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields",
                missingFields: emptyFields
            });
        }




        // Upload images to Cloudinary
        const uploadedImages = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const tempFilePath = path.join(__dirname, `temp_${file.originalname}`);

            // Write the buffer data to the temporary file
            await fs.writeFile(tempFilePath, file.buffer);

            // Upload the temporary file to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
                folder: 'diva story',
                public_id: file.originalname
            });

            // Push the secure URL of the uploaded image to the array
            uploadedImages.push(uploadResult.secure_url);

            // Remove the temporary file after uploading
            await fs.unlink(tempFilePath);
        }

        // Create a new product instance
        const newProduct = new Product({
            img: uploadedImages[0],
            productName,
            sizes:sizess, // Assign the parsed sizes here
            secondImg: uploadedImages[1] || uploadedImages[0],
            thirdImage: uploadedImages[2] || uploadedImages[0],
            fourthImage: uploadedImages[3] || uploadedImages[0],
            discountPrice,
            mainPrice,
            percentage,
            collectionName,
            description,
            SKU,
            availability,
            categories,
            tags
        });

        // Save the new product to the database
        await newProduct.save();
        console.log(`New`,newProduct)
        res.status(200).json({
            success: true,
            msg: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

