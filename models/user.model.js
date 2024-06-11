const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    // emailVerified: {
    //     type: Boolean,
    //     default: false
    // },
    isActive: {
        type: Boolean,
        default: false,
    },

    Role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    OtpForVerification: {
        type: Number
    },
    ForgetPasswordOtp: {
        type: String
    },
    OtpGeneratedAt: {
        type: Date,
    }
}, { timestamps: true });

// Middleware to hash the password before saving
UserSchema.pre('save', async function (next) {

    // Instilize user with this
    const user = this;

    // check if the password is modified
    if (!user.isModified('password')) {
        return next();
    }

    // Hash the password using bcrypt 
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        return next("Password Hashing Error");
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed', error);
    }
};

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model('UserSchemaDetails', UserSchema);
