const path = require('path');

const express = require('express');

 const adminController = require('../controllers/admin');

 //this is for checking authenticate routes 
 const authRoute=require('../auth-routes/isAllow');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',authRoute, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId',authRoute, adminController.getEditProduct);

router.post('/edit-product',authRoute, adminController.postEditProduct);

router.post('/delete-product',authRoute, adminController.postDeleteProduct);

module.exports = router;
