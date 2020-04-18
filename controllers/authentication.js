
const User = require('../models/user');
const md5 = require('md5');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.APIKEY);

const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }

});


exports.getLogIn = (req, res, next) => {


    const msg = req.flash('errMsg');

    res.render('authentication/logIn.ejs', {


        pageTitle: 'LOG IN',
        path: '',
        messege: (msg.length > 0) ? msg : false,
        oldInput:{email:'',password:''}

    });
}

exports.getSignUp = (req, res, next) => {



    const msg = req.flash('err');

    res.render('authentication/signup', {

        pageTitle: 'SIGN UP',
        path: 'signup',
        oldInput:{email:'',password:''},
        messege: (msg.length > 0) ? msg : false

    });


}

exports.postSignUp = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    var token;

    crypto.randomBytes(32, (err, buff) => {
        if (err) {
            
           const error=new Error(err.message);
           error.httpStatusCode=500;
            return next(error);
        }

        token = buff.toString('hex');
    })

    const error = validationResult(req);

    if (!error.isEmpty()) {

        return res.status(422).render('authentication/signup.ejs', {

            pageTitle: 'SIGN UP',
            path: '',
            messege: error.array()[0].msg,
            oldInput:{email:email,password:password}

        })

    }



    bcrypt
        .hash('123', 12)
        .then(hashPwd => {
            console.log(hashPwd);

            const newUser = new User({
                email: email,
                password: hashPwd,
                initValidateToken: token,
                cart: { item: [] }
            });

            return newUser.save();


        })
        .then(() => {

            var emailME = {
                to: email,
                from: 'damithanuradha44@gmail.com',
                subject: 'shopMe sign Up success',
                html: `<p>thanks for sign up into shopMe have a good experiece</p>
                        <h3>use this link to frist log in <a href='http://localhost:3000/log-in/${token}'>LOG IN</a></h3>
                `
            };

            sgMail.send(emailME)
                .then(() => {
                    res.redirect('/log-in');
                })
                .catch(err=>{

                })

        })
        .catch(err => {
            const error=new Error(err.message);
            error.httpStatusCode=500;
             return next(error);
        });

}

exports.postLogIn = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const error = validationResult(req);

    if (!error.isEmpty()) {

       
        return res.status(422).render('authentication/logIn.ejs', {

            pageTitle: 'SIGN UP',
            path: '',
            messege: error.array()[0].msg,
            oldInput:{email:email,password:password}

        })

      
    }

    req.session.isEnable = true;
    req.session.user = req.params.user;
    req.session.save(() => {
        res.redirect('/');

    })




}

exports.postLogOut = (req, res, next) => {

    req.session.destroy(() => {

        res.redirect('/');
    });

}

exports.getPasswordRest = (req, res, next) => {

    const msg = req.flash('err');

    res.render('authentication/passwordReset', {

        pageTitle: "PASSWORD RESET",
        path: '',
        messege: (msg.length > 0) ? msg : false



    })

}

exports.postPasswordRest = (req, res, next) => {

    const email = req.body.email;
    var tocken;

    crypto.randomBytes(32, (err, buff) => {
        if (err) {
            req.flash('err', 'some error occure');
        }

        tocken = buff;
    })

    User.findOne({ email: email })
        .then(user => {
            console.log(user);
            if (!user) {
                req.flash('err', 'Invalid Email address');
                res.redirect("/password-reset");
            }

            user.resetTocken = tocken.toString('hex');
            user.resetExpire = Date.now() + 3600000;

            user.save()
                .then(result => {

                    return sgMail.send({

                        from: 'damithanuradha44@gmail.com',
                        to: 'tharindha.lakmal@gmail.com',
                        subject: 'shopMe password reset',

                        html: `<p>click the link to reset password <a href='http://localhost:3000/reset/${tocken.toString('hex')}' >RESET NOW</a> </p>`

                    })

                })
                .then(result => {
                    res.redirect('/log-in');
                })





        })
        .catch(err => {
            const error=new Error(err.message);
           error.httpStatusCode=500;
            return next(error);
        })

}

exports.getResetPasswordHandler = (req, res, next) => {

    const resetId = req.params.resetId;


    User.findOne({ resetTocken: resetId })
        .then(user => {

            res.render('authentication/resetNewPassword.ejs', {

                pageTitle: 'RESET PASSWORD',
                path: '',
                userId: user._id,
                passwordToken: resetId


            });


        })
        .catch(err => {
            const error=new Error(err.message);
            error.httpStatusCode=500;
             return next(error);
        })
}

exports.postResetUpdatePassword = (req, res, next) => {

    const password = md5(req.body.password);
    const token = req.body.passwordToken;
    const confirmPassword = md5(req.body.confirmPassword);
    const userId = req.body.userId;



    User.findOne({ _id: userId, resetTocken: token })
        .then(user => {

            user.password = md5(password);
            user.resetTocken = null;
            user.resetExpire = null;

            return user.save();

        })
        .then(() => {
            res.redirect('/log-in');
        })
        .catch(err => {
            const error=new Error(err.message);
            error.httpStatusCode=500;
             return next(error); 
        })



}