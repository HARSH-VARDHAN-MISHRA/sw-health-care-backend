

const path = require('path')
const fs = require('fs')
const bannerModel = require('../models/banner.model')
const cloudinary = require("cloudinary").v2



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


// Sales Banner Controller 
exports.createBanner = async (req, res) => {
    try {
        console.log(req.body);
        const { title,active } = req.body;
        const {bannerImage} =req.file;
        if (!title || !active ) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingBanner = await bannerModel.findOne({ title: title });
        if (existingBanner) {
            return res.status(403).json({
                success: false,
                message: "Banner Already Exist !!"
            });
        }

        const newBanner = new bannerModel({ title,active })
        console.log(req.file)
        if (req.file) {
            const url = await uploadImg(req.file.path)
            newBanner.bannerImage = url
        }
        await newBanner.save();
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {}
        res.status(200).json({
            success: true,
            data: newBanner,
            message: "Banner Created Successfully !!"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
}
exports.getAllBanner = async (req,res) =>{
    try {
        const getAllBanner = await bannerModel.find();
        if(getAllBanner === 0){
            return res.status(400).json({
                success: false,
                msg: "Banner Not Avilable Now"
            })
        }
        res.status(201).json({
            success:true,
            data:getAllBanner,
            msg: "All Banner Found"
        })
        
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.deleteBanner = async (req, res) => {
    try {
        const id = req.params.id;
        const checkBanner = await bannerModel.deleteOne({ _id: id })
        if (!checkBanner) {
            return res.status(403).json({
                success: false,
                msg: "Banner Not Found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Banner Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.updateBanner = async (req, res) => {
    try {
        const BannerId = req.params.id;
        const updates = req.body;

        if (Object.keys(updates).length === 0 && !req.file) {
            return res.status(400).json({
                success: false,
                msg: "No fields to update."
            });
        }

        // If there's an image file in the request, handle the image upload
        if (req.file) {
            const url = await uploadImg(req.file.path);
            updates.bannerImage = url; // Add the image URL to the updates object
        }

        const options = { new: true }; // Return the modified document
        const updatedBanner = await bannerModel.findByIdAndUpdate(BannerId, updates, options);

        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                msg: "Banner not found."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Banner updated successfully.",
            data: updatedBanner
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

