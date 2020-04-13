const express=require('express');

const errorController=require('../controllers/errorController');

const route=express.Router();

route.get('/404',errorController.ErrorPage404 );

module.exports=route;