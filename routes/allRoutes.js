const express = require('express');

const route = express.Router();

const multer = require("multer")
const { createCategory, getAllCategory, deleteCategory, updateCategory } = require('../controlers/webcontroler')
const { createProduct, getAllProduct, deleteProduct, updateProduct } = require('../controlers/ProductController');
const { createSaleBanner, getAllSaleBanner, deleteSaleBanner, updateSaleBanner } = require('../controlers/salesBannerController');
const { createBanner, getAllBanner, deleteBanner, updateBanner } = require('../controlers/BannerController');
const { createTag, getAllTag, deleteTag, updateTag } = require('../controlers/TagControler');
const { register, LoginUser, ResendSignOtp, ResendOtp, PasswordChangeRequest, verifyOtpForSignIn, VerifyOtp } = require('../controlers/UserControler');
const { CreateOrder } = require('../controlers/OrderController');
const { isAuthenticatedUser } = require('../middlewares/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Public/category")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});


const multerUploads = multer({ storage }).array('images')
const SingleUpload = multer({ storage }).single('image')

const upload = multer({storage:storage})

// -- Authentication ---- 
route.post("/register",register) // create Account

route.post('/Password-change-request', PasswordChangeRequest);
route.post('/Resend-Otp', ResendOtp);
route.post('/Verify-sign-Otp', verifyOtpForSignIn);
route.post('/resend-sign-Otp', ResendSignOtp);
route.post('/Verify-Otp/:email/:newPassword', VerifyOtp)

route.post("/login",LoginUser);

// -- categories --- 
route.post("/create-category",upload.single("categoryImage") ,createCategory );
route.get("/get-all-category",getAllCategory);
route.delete('/delete-category/:id',deleteCategory);
route.put('/update-category/:id',upload.single("categoryImage"),updateCategory);

// -- Products ---- 
route.post("/create-product",createProduct );
route.get("/get-all-product",getAllProduct );
route.delete("/delete-product/:id",deleteProduct );
route.put("/update-product/:id",updateProduct );

// -- Sales banner --- 
route.post("/create-sale-banner",upload.single("saleBannerImage") ,createSaleBanner );
route.get("/get-all-sale-banner",getAllSaleBanner);
route.delete('/delete-sale-banner/:id',deleteSaleBanner);
route.put('/update-sale-banner/:id',upload.single("saleBannerImage"),updateSaleBanner);

// -- Main  banner --- 
route.post("/create-main-banner",upload.single("bannerImage") ,createBanner );
route.get("/get-all-main-banner",getAllBanner);
route.delete('/delete-main-banner/:id',deleteBanner);
route.put('/update-main-banner/:id',upload.single("bannerImage"),updateBanner);

// -- Sales banner --- 
route.post("/create-tag",createTag );
route.get("/get-all-tag",getAllTag);
route.delete('/delete-tag/:id',deleteTag);
route.put('/update-tag/:id',updateTag);


route.post('/create-order', isAuthenticatedUser, CreateOrder)



module.exports = route