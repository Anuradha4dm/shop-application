const { check } = require('express-validator/check');
const { body } = require('express-validator/check');

exports.emailValidation = [check('email')
    .isEmail()
    .withMessage('Please enter valid email ')];


exports.passwordValidation= [check('password')
.isLength({min:6})
.withMessage('password must contain at least 6 characters')
]

exports.passwordCheck= body('confirmPassword')
.custom((value,{req})=>{

    if(value!=req.body.password){

         throw new Error('passwords are not match');
    }

    return true;

})


