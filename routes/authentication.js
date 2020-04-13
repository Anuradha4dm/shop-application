const express=require('express');

//optional validators
const {check}=require('express-validator/check');

//my midleware
const authentication=require('../controllers/authentication');
const validation=require('../validation/formValidation');

const route=express.Router();

route.get('/log-in',authentication.getLogIn);

route.post('/log-in',authentication.postLogIn);

route.get('/signup',authentication.getSignUp);

route.post('/signup',validation.passwordValidation,validation.emailValidation,validation.passwordCheck,authentication.postSignUp);

route.get('/log-out',authentication.postLogOut);

route.get('/password-reset',authentication.getPasswordRest);

route.post('/password-reset',authentication.postPasswordRest);

route.get('/reset/:resetId',authentication.getResetPasswordHandler);

route.post('/new-resetpwd',authentication.postResetUpdatePassword);



module.exports=route;