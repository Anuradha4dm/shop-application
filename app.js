//core modules
const path = require('path');
require('dotenv').config();

//optional madules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoSession = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const md5 = require('md5');


//insert my modules
const User = require('./models/user');

//this is for handling csrf arracts
const csrf = require('csurf');
const csrfProtection = csrf();

//thus is the mongo db connetion string
const MONGO_URL = 'mongodb+srv://Anuradha:Damith123@cluster0-abiin.mongodb.net/shop';

const app = express();

//set view engine set up
app.set('view engine', 'ejs');
app.set('views', 'views');

//set read file  contents
const fileStorage = multer.diskStorage({

    destination: (req, file, callback) => {

        callback(null, 'images');

    },
    filename: (req, file, callback) => {

        callback(null,  file.originalname);

    }

});
const fielFilterFN = (req, file, callback) => {

    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }

}



//adding routes 
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authentication = require('./routes/authentication');
const error = require('./routes/error');

//set body parser to extract data from the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,'images')));

app.use(multer({ storage: fileStorage,fileFilter: fielFilterFN }).single('image'));


//woking with sessions
const storeSession = new MongoSession({
    uri: MONGO_URL,
    collection: 'session'
}, (err) => {
    if (err) {
        throw new Error(err);
    }
});

app.use(session({
    secret: "me",
    resave: false,
    saveUninitialized: false,
    store: storeSession

}));


app.use((req, res, next) => {



    if (!req.session.user) {


        return next();
    }

    User.findOne(req.session.user._id)
        .then(user => {
            if (!user) {

                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {

            throw new Error(err);
        })

});

app.use(csrfProtection);
app.use(flash());

app.use(function (req, res, next) {

    res.locals.isLogIn = req.session.isEnable;
    res.locals.csrfNumbrt = req.csrfToken();
    next();
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authentication);
app.use(error.get404);

app.use((error, req, res, next) => {

    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404',isLogIn:req.session.isEnable });
    
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {

        console.log('connection success');
        app.listen(3000);

    })


    .catch(err => {
        console.log('ser');
        console.log(err);
    })
