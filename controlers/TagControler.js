const tagModel = require("../models/tag.model");

exports.createTag = async (req, res) => {
    try {
        console.log(req.body)
        const { title ,TagColour } = req.body;
        if (!title || !TagColour) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields !!"
            })
        }

        const existingTag = await tagModel.findOne({ title: title });
        if (existingTag) {
            return res.status(403).json({
                success: false,
                message: "Tag Already Exists !!"
            });
        }

        const newTag = new tagModel({
            title ,
            TagColour
        })
        await newTag.save();
        res.status(200).json({
            success: true,
            data: newTag,
            message: "Tag Created Successfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.getAllTag = async (req, res) => {
    try {
        const getAllTag = await tagModel.find();
        if (getAllTag.length === 0) {
            return res.status(403).json({
                success: false,
                msg: "Tag Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: getAllTag,
            msg: "All Tags Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.deleteTag = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTag = await tagModel.deleteOne({ _id: id })
        if (!checkTag) {
            return res.status(403).json({
                success: false,
                msg: "Tag Not Found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Tag Deleted Succesfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
exports.updateTag = async (req, res) => {
    try {
        const tagId = req.params.id;
        const updates = req.body;

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No fields to update."
            });
        }

        const options = { new: true }; // Return the modified document
        const updatedTag = await tagModel.findByIdAndUpdate(tagId, updates, options);
        if (!updatedTag) {
            return res.status(404).json({
                success: false,
                msg: "tagModel not found."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Tag updated successfully.",
            data: updatedTag
        });
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

