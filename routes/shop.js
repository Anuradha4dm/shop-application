const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

//this is for authentication routes
const authRoute=require("../auth-routes/isAllow");

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

 router.get('/products/:productId',authRoute, shopController.getProduct);

 router.get('/cart',authRoute, shopController.getCart);

 router.post('/cart',authRoute, shopController.postCart);

 router.post('/order-item',authRoute,shopController.postOrder);

 router.post('/cart-delete-item',authRoute, shopController.postCartDeleteProduct);

 router.get('/orders',authRoute,authRoute, shopController.getOrders);

// // router.get('/checkout', shopController.getCheckout);

module.exports = router;
