

const path = require('path')
const fs = require('fs')
const cloudinary = require("cloudinary").v2

const categoryDetail = require('../models/category.model')

cloudinary.config({
    cloud_name: "dohzhn0ny",
    api_key: "899193287131934",
    api_secret: "RN9ldy9uHfeWDTqWRPOX2-cvgMg"
})

const uploadImg = async (file) => {
    try {
        const imageData = await cloudinary.uploader.upload(file)
        return imageData.secure_url
    } catch (error) {
        console.log(error)
    }
}


// Categories 
exports.createCategory = async (req, res) => {
    try {
        console.log(req.body);
        const { categoryName } = req.body;
        const {categoryImage} =req.file;
        if (!categoryName ) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingCategory = await categoryDetail.findOne({ categoryName: categoryName });
        if (existingCategory) {
            return res.status(403).json({
                success: false,
                message: "Category Already Exists !!"
            });
        }

        const newCategory = new categoryDetail({ categoryName })
        console.log(req.file)
        if (req.file) {
            const url = await uploadImg(req.file.path)
            newCategory.categoryImage = url
        }
        await newCategory.save();
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {}
        res.status(200).json({
            success: true,
            data: newCategory,
            message: "Category Created Successfully !!"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
}
exports.getAllCategory = async (req,res) =>{
    try {
        const getAllCate = await categoryDetail.find();
        if(getAllCate === 0){
            return res.status(400).json({
                success: false,
                msg: "Category Not Avilable Now"
            })
        }
        res.status(201).json({
            success:true,
            data:getAllCate,
            msg: "All Categories Found"
        })
        
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const checkCate = await categoryDetail.deleteOne({ _id: id })
        if (!checkCate) {
            return res.status(403).json({
                success: false,
                msg: "category Not Found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Category Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.updateCategory = async (req,res) =>{
    try {
        const categoryId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedCategory = await categoryDetail.findByIdAndUpdate(categoryId, updates, options);
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                msg: "categoryDetail not found."
            });
        }
        res.status(200).json({
            success: true,
            msg: "Category updated successfully.",
            data: updatedCategory
        });
        
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
