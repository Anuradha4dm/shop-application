const { check } = require('express-validator/check');
const { body, param } = require('express-validator/check');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.emailValidation = [check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email ')
    .custom((value, { req }) => {

        return User.findOne({ email: value })
            .then(user => {

                if (user) {
                    return Promise.reject('user is already exisit');

                }

            })
            .catch(err => {
                throw Error(err);
            })


    })


];


exports.passwordValidation = [check('password')
    .isLength({ min: 3 })
    .withMessage('password must contain at least 6 characters')
]

exports.passwordCheck = [body('confirmPassword')
    .custom((value, { req }) => {

        if (value != req.body.password) {

            throw new Error('passwords are not match');
        }

        return true;

    })]

//this is for log in 
exports.initLoginValidate = [param('validationId')

    .custom((value, { req }) => {

        return User.findOne({ initValidateToken: value })
            .then(user => {

                if (!user) {

                    throw new Error('User token is invalid ');

                }

                user.isInitValid = true;
                user.initValidateToken = undefined;
                return user.save();

            })

    })
];

exports.authenticateUser = [body('email')
    .normalizeEmail()
    .custom((value, { req }) => {

        return User.findOne({ email: value })
            .then(user => {

                if (!user) {
                    throw new Error("Invalid e-mail");
                }

                return bcrypt.compare(req.body.password, user.password)
                    .then(result => {

                        if (!result) {
                            throw new Error('');
                        }
                        else {
                            req.params.user = user;
                        }

                    })
                    .catch(err => {
                        throw new Error('Invalid Password');
                    })



            })

    })

];

exports.isInitValidLogIn = [body('email')
    .normalizeEmail()
    .custom((value, { req }) => {

        return User.findOne({ email: value })
            .then(user => {

                if (!user.isInitValid) {
                    throw new Error('Ckeck Your emails and use that link to first log in');
                }


            })

    })

];




