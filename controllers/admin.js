const Product = require('../models/product');
const { validationResult } = require('express-validator/check');
const deleteFile = require('../util/fileHelper').deleteFile;



exports.getAddProduct = (req, res, next) => {


  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLogIn: req.session.isEnable,
    messege: '',
    prePopulate: undefined

  });
};

exports.postAddProduct = (req, res, next) => {

  console.log("dfaf");

  const title = req.body.title;
  const imageFile = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const error = validationResult(req).errors;
  console.log(error[0]);



  if (!imageFile) {

    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isLogIn: req.session.isEnable,
      messege: 'Problem in Image',
      prePopulate: {
        oldtitle: title,
        oldprice: price,
        olddescription: description
      },

    });

  }

  const product = new Product({
    title: title,
    imageUrl: imageFile.path,
    price: price,
    description: description, userId: req.session.user

  });

  product.save()
    .then(result => {

      console.log("product id added successfully");
      res.redirect('/product');

    })
    .catch(err => {
      console.log(err);
    });


};

exports.getEditProduct = (req, res, next) => {



  const productId = req.params.productId;
  const productEditMode = req.query.edit;

  Product.findOne({ _id: productId, userId: req.user._id })
    .then(product => {

      res.render('admin/edit-product.ejs', {

        path: '',
        pageTitle: 'EDIT PRODUCT',
        editing: productEditMode,
        product: product,
        isLogIn: req.session.isEnable
      });

    })
    .catch((err) => {
      console.log(err);
    });

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOne({ _id: prodId, userId: req.user._id })
    .then(product => {

      //if image exists then delete that 
      deleteFile(product.imageUrl);

      product.title = req.body.title;
      product.imageUrl = req.file;
      product.description = req.body.description;
      product.price = req.body.price;


      if (!req.file) {

        return res.render(`admin/edit-product/${prodId}`, {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: true,
          isLogIn: req.session.isEnable,
          messege: 'Problem in Image',
          prePopulate: {
            oldtitle: title,
            oldprice: price,
            olddescription: description
          },

        });

      }


      return product.save();

    })
    .then(result => {

      console.log("PRODUCT UPDATED SUCCESSFULLY.........")
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });


};

exports.getProducts = (req, res, next) => {


  Product.find({ userId: req.user._id })
    .then(products => {

      res.render('admin/products.ejs', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isLogIn: req.session.isEnable
      });


    })
    .catch(err => {

      console.log(err);
    });



};

exports.deleteProduct = (req, res, next) => {

  const prodId = req.params.productId;
  

  Product.findOne({ _id: prodId })
    .then(product => {

      if (product) {
        deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id });
      }

    })
    .then(result => {

      console.log("product wad deleted successfully..............");
      res.status(200).json({message:'deleting succuss'});
    })
    .catch(err => {
      res.status(500).json({message:'deleting failed'});
    });
};
