const path = require('path');

const express = require('express');

 const adminController = require('../controllers/admin');
 const addProductValidation=require('../validation/addProductValidation');

 //this is for checking authenticate routes 
 const authRoute=require('../auth-routes/isAllow');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',authRoute,addProductValidation.fieldValidations, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId',authRoute, adminController.getEditProduct);

router.post('/edit-product',authRoute, adminController.postEditProduct);

router.delete('/product/:productId',authRoute, adminController.deleteProduct);

module.exports = router;
