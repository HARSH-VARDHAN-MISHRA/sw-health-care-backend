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
        type:Number,
        unique:true
    },
    password: {
        type: String,
        trim: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Middleware to hash the password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model('UserSchemaDetails',UserSchema);
