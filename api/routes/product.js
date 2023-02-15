const express = require('express');
const { default: mongoose } = require('mongoose');
const product = require('../models/product');
const router = express.Router();
const multer = require('multer');

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
// The Location of file to be stored, filfilter, and limiting the file size
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
// IMPORTING productSchema
const Product = require('../models/product');


// DEFINING ROUTES-----------------------------------------------------------------------------

// FETCHING ALL THE PRODUCTS

router.get('/', (req, res, next)=> {
    Product.find()
        .exec()
        .then(
            (docs)=> {
                console.log(docs);
                const newResponse = {
                    count: docs.length,
                    product: docs.map( doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            productImage: doc.productImage,
                            request: {
                                type: 'GET',
                                url: 'https://localhost:3000/products/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(newResponse);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        })
    })

/* FETCHING SINGLE PRODUCT   */

router.get('/:productID', (req, res, next)=> {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log('from database' + doc);
        if(doc){
            res.status(200).json(
                {
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3000/products/' + doc._id
                    }
                }
            );
        }
        else{
            res.status(404).json({message: 'No valid entry found for provided ID'})
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

/* HANDLING POST REQUEST */

router.post('/', upload.single('productImage'),(req, res, next)=> {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //Saving the new product
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Product Successfully!',
                createdProducts: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3000/products/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productID', (req, res, next)=> {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body}, {new: true})
    .then(result => {
        res.status(200).json({
            message: "Product updated!",
            request: {
                type: 'GET',
                url: 'https://localhost:3000/products/' + result._id
            }
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.delete('/:productID', (req, res, next)=> {
    const id = req.params.productID;
    Product.remove({
        _id: id
    })
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Deleted!',
            request: {
                type: 'POST',
                url: 'https://localhost:3000/products/',
                body: { 
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;