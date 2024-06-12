const ErrorHander = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
exports.isAuthenticatedUser = async (req, res, next) => {
    const  token  = (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
    // console.log(token)
    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
};