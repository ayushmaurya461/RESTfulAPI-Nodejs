const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


exports.get_all_orders = (req, res, next)=> {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then( result => {
            console.log(result);
            res.status(200).json({
                count: result.length,
                orders: result.map( doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/'+ doc._id
                        }
                    }
                })
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_single_order = (req, res, next)=> {
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then( order => {
            if(!order){
                return res.status(404).json({
                    message: "Order Not Found."
                })
            }
            console.log(order);
            res.status(200).json({
                order: order,
                request:{
                type: 'GET',
                url: 'https://localhost:3000/orders'
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.post_order = (req, res, next)=> {
    Product.findById(req.body.productID)
        .then( product => {
            if(!product){
                return res.status(500).json({
                    message: "Product not found."
                })
            };
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            })
             return order.save(); 
        })
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: "Order received",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: 'http:/localhost:3000/orders/' + result._id
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                message: "Product not found",
                error: err
            });
        });
}

exports.delete_order = (req, res, next)=> {
    Order.remove({_id: req.params.orderID})
    .then( result => {
        console.log(result);
        if(result.deletedCount <= 0){
            return res.status(404).json({
                message: "No Order found."
            })
        }
        res.status(200).json({
            message:  req.params.orderID + ' order deleted',
            request: {
                type: 'POST',
                url: 'https://localhost:4200/orders',
                body: {
                    productID: 'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: "Order not found"
        })
    })
}