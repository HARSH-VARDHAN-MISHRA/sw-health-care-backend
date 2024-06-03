const categoryRouter = require('express').Router()

const multer = require("multer")
const { createCategory, getAllCategory, deleteCategory, updateCategory } = require('../controlers/webcontroler')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Public/category")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage:storage})

// -- categories --- 
categoryRouter.post("/create-category",upload.single("categoryImage") ,createCategory )
categoryRouter.get("/get-all-category",getAllCategory);
categoryRouter.delete('/delete-category/:id',deleteCategory);
categoryRouter.post('/update-category/:id',updateCategory);

// -- Products ---- 


module.exports = categoryRouter