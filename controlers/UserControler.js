
const userModel = require("../models/user.model");
const sendToken = require("../utils/sendToken");


exports.register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                error: "Please Enter Name, Email, Phone Number and Password"
            });
        }

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: "Email already exists"
            });
        }

        // Attempt to create the user
        user = await userModel.create({
            name,
            email,
            phoneNumber,
            password,
        });

        // Check if the user was successfully created
        if (!user) {
            return res.status(500).json({
                success: false,
                error: "Failed to create user"
            });
        }

        // If the user was successfully created, send token
        sendToken(user, 201, res);
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            const duplicateKey = Object.keys(error.keyValue)[0];
            const errorMessage = `${duplicateKey.charAt(0).toUpperCase() + duplicateKey.slice(1)} already exists`;
            return res.status(400).json({
                success: false,
                error: errorMessage
            });
        }
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

//Login
exports.LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                msg: "Please Fill All Field"
            })
        }
        //after this check user
        const existUser = await userModel.findOne({ email })
        if (!existUser) {
            return res.status(401).json({
                success: false,
                msg: "User not Avilable"
            })
        }
        //if user found
        const checkPassword = await existUser.comparePassword(password)
        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                msg: "Password is Invalid"
            })
        }

        sendToken(existUser, 201, res)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

//Logout
exports.Logout = async (req, res) => {
    try {
        // Clear the JWT token cookie
        res.clearCookie('token');

        // Send a success response
        return res.status(200).json({
            success: true,
            msg: "Logout successful"
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};


//get-All-users
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find({}, { password: 0 });
        if (!allUsers.length > 0) {
            return res.status(403).json({
                success: false,
                msg: "Not available"
            });
        }
        res.status(200).json({
            success: true,
            users: allUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
}

//Password Change
