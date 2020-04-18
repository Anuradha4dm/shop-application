
const { check } = require('express-validator/check');

const fieldValidation = [
    check('title')
    .isString()
    .isLength({min:6})
    .trim()
    ,
    check('price')
    .isFloat()
    ,
    check('description')
    .isString()
    .trim()

]

exports.fieldValidations=fieldValidation;