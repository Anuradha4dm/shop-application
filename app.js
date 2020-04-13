//core modules
const path = require('path');
require('dotenv').config();

//optional madules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoSession = require('connect-mongodb-session')(session);
const flash=require('connect-flash');


//insert my modules
const User = require('./models/user');

//this is for handling csrf arracts
const csrf=require('csurf');
const csrfProtection=csrf();


const MONGO_URL = 'mongodb+srv://Anuradha:Damith123@cluster0-abiin.mongodb.net/shop';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const authentication = require('./routes/authentication');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//woking with sessions
const storeSession = new MongoSession({
    uri: MONGO_URL,
    collection: 'session'
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

            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })

});

app.use(csrfProtection);
app.use(flash());

app.use(function (req, res, next) {

    res.locals.isLogIn = req.session.isEnable;
   res.locals.csrfNumbrt=req.csrfToken();
    next();
  })
  

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authentication);
app.use(errorController.get404);

mongoose.connect(MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(result => {

        console.log('connection success');
        app.listen(process.env.PORT);

    })


    .catch(err => {
        console.log(err);
    })
