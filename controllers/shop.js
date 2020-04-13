
const Product = require('../models/product');
const User = require('../models/user');
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {


  Product.find()
    .then((products) => {

      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isLogIn:req.session.isEnable
        
      });
    })
}

exports.getProduct = (req, res, next) => {


  const prodId=res.params.productId;

  Product.findOne({ _id: prodId })
    .then(product => {


      return res.render('shop/product-detail', {

        product: product,
        path: '/prodcuts',
        pageTitle: product.title,
        isLogIn:req.session.isEnable
       
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

  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isLogIn:req.session.isEnable
        
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {

  

  req.user.populate('cart.item.productId')
    .execPopulate()
    .then(user => {
      
      res.render('shop/cart.ejs', { path: '/cart', products: req.user.cart.item, pageTitle: '404 PAGE',isLogIn:req.session.isEnable});
    })
    .catch(err=>{
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

      console.log(arr);

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
        isLogIn:req.session.idEnable
        
      });

      req.user.removeCart();
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
