
const Product = require('../models/product');
const User = require('../models/user');
const Order = require("../models/order");

const IMAGES_PER_PAGE = 2;

const PdfKit = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getProducts = (req, res, next) => {

  const page = +req.query.page  || 1;
  var totalNumberOfProducts;

  Product.find()
    .countDocuments()
    .then(numberOfProducts => {
      totalNumberOfProducts =numberOfProducts;

      return Product.find()
        .skip((page - 1) * IMAGES_PER_PAGE)
        .limit(IMAGES_PER_PAGE);


    })
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
        isLogIn: req.session.isEnable,
        totalProducts:totalNumberOfProducts,
        isPrevious:page>1,
        isNext:(IMAGES_PER_PAGE*page)<totalNumberOfProducts,
        nextPage:page+1,
        previousPage:page-1,
        lastPage: Math.ceil(totalNumberOfProducts/IMAGES_PER_PAGE),
        currentPage:page


      });
    })
    .catch(err => {
      console.log('in');
      const error = new Error(err.message);
      error.httpStatusCode = 404;
      return next(error);
    })
}

exports.getProduct = (req, res, next) => {


  const prodId = res.params.productId;
  

  Product.findOne({ _id: prodId })

    .then(product => {


      return res.render('shop/product-detail', {

        product: product,
        path: '/prodcuts',
        pageTitle: product.title,
        isLogIn: req.session.isEnable

      });
    })
    .then(() => {
      console.log('add');
    })
    .catch(err => {
      console.log(err);
    })


}


exports.getIndex = (req, res, next) => {

  const page = +req.query.page  || 1;
  var totalNumberOfProducts;

  Product.find()
    .countDocuments()
    .then(numberOfProducts => {
      totalNumberOfProducts =numberOfProducts;

      return Product.find()
        .skip((page - 1) * IMAGES_PER_PAGE)
        .limit(IMAGES_PER_PAGE);


    })
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isLogIn: req.session.isEnable,
        totalProducts:totalNumberOfProducts,
        isPrevious:page>1,
        isNext:(IMAGES_PER_PAGE*page)<totalNumberOfProducts,
        nextPage:page+1,
        previousPage:page-1,
        lastPage: Math.ceil(totalNumberOfProducts/IMAGES_PER_PAGE),
        currentPage:page


      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {



  req.user.populate('cart.item.productId')
    .execPopulate()
    .then(user => {

      res.render('shop/cart.ejs', { path: '/cart', products: req.user.cart.item, pageTitle: '404 PAGE', isLogIn: req.session.isEnable });
    })
    .catch(err => {
      console.log(err);
    })



};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOne({ _id: prodId })
    .then(product => {

      const cartItems = [...req.user.cart.item];



      const cartItemIndex = cartItems.findIndex(p => {

        return p.productId.toString() == prodId;

      });



      if (cartItemIndex >= 0) {

        newQuantity = cartItems[cartItemIndex].quantity + 1;

        cartItems[cartItemIndex].quantity = newQuantity;
        req.user.cart.item = cartItems;

      }
      else {

        cartItems.push({ productId: product, quantity: 1 });
        req.user.cart = { item: cartItems };

      }
      return req.user.save();

    })
    .then(result => {

      console.log("cart is updated");
      res.redirect('/cart');
    })

    .catch(err => {
      console.log(err);
    });



};


exports.postOrder = (req, res, next) => {

  req.user
    .populate("cart.item.productId")
    .execPopulate()
    .then(user => {

      const arr = user.cart.item.map(item => {

        return { productId: item.productId._id, quantity: item.quantity }

      });

      const newOrder = new Order({ userId: req.user._id, products: arr });

      return newOrder.save();


    })
    .then(() => {

      res.redirect('/orders');

    })
    .catch(err => {
      console.log(err);
    });


};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;


  req.user.removeItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      cosnsole.log(err);
    })



};


exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .populate("products.productId")
    .exec()
    .then(orders => {


      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isLogIn: req.session.idEnable

      });

      req.user.removeCart();
    })
    .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {

  const orderId = req.params.orderId;
  const fileName = 'invoice_' + orderId + '.pdf';
  const filePath = path.join('data', 'invoice', fileName);

  const doc = new PdfKit();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment;filenem=' + fileName);
  // doc.pipe(fs.createWriteStream(filePath));


  Order.findOne({ _id: orderId })
    .populate("products.productId")
    .then(order => {



      doc
        .fontSize(32)
        .text('INVOICE', { underline: true, align: 'center' });

      doc.moveTo(10, 120)                               // set the current point
        .lineTo(500, 120)
        .stroke();

      order.products.forEach(prod => {

        doc
          .fontSize(18)
          .text(`TITLE :${prod.productId.title}`)
      })

      doc.pipe(res);

      doc.end();

    })



  //this is not the best way to do that
  // fs.readFile(filePath,(err,data)=>{

  //   if(err){
  //     console.log(err);
  //     return next(err);
  //   }

  //     res.setHeader('Content-Type','application/pdf');
  //     res.setHeader('Content-Disposition',"attachment;filename="+fileName);
  //   res.send(data);



  // })

  // const fileStream = fs.createReadStream(filePath);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', "attachment;filename=" + fileName);

  // fileStream.pipe(res);



}

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
