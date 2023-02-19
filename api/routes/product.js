const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


// IMPORTING productSchema
const Product = require('../models/product');
const { get_all_products, get_single_product, add_product, patch_product, delete_product } = require('../controllers/product');

// Specifying storage path
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})
// Filter for fileType
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}
// The Location of file to be stored, filefilter, and limiting the file size
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// DEFINING ROUTES-------------------------------
router.get('/', get_all_products);
router.get('/:productID', get_single_product);
router.post('/', checkAuth, upload.single('productImage'), add_product);
router.patch('/:productID', checkAuth, patch_product);
router.delete('/:productID', checkAuth, delete_product);

module.exports = router;