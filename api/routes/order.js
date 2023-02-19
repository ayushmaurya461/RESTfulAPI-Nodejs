const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { get_single_order, get_all_orders, post_order, delete_order } = require('../controllers/order');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

//Defining Routes
router.get('/', checkAuth, get_all_orders);
router.get('/:orderID', checkAuth, get_single_order)
router.post('/', checkAuth, post_order);
router.delete('/:orderID', checkAuth, delete_order);

module.exports = router;