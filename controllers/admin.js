const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {

  

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLogIn:req.session.isEnable
  });
};

exports.postAddProduct = (req, res, next) => {

  
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log(req.session);
  const product = new Product({ title: title, imageUrl: imageUrl, price: price, description: description ,userId:req.session.user});

  product.save()
    .then(result => {

      console.log("product id added successfully");
      res.redirect('prosuct');

    })
    .catch(err => {
      console.log(err);
    });


};

exports.getEditProduct = (req, res, next) => {



  const productId = req.params.productId;
  const productEditMode = req.query.edit;

  Product.findOne({ _id: productId , userId: req.user._id })
    .then(product => {


      res.render('admin/edit-product.ejs', {

        path: '',
        pageTitle: 'EDIT PRODUCT',
        editing: productEditMode,
        product: product,
        isLogIn:req.session.isEnable
      });

    })
    .catch((err) => {
      console.log(err);
    });

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOne({ _id: prodId ,userId:req.user._id })
    .then(product => {

      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      product.price = req.body.price;
    

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


  Product.find({userId:req.user._id})
    .then(products => {

      res.render('admin/products.ejs', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isLogIn:req.session.isEnable
      });


    })
    .catch(err => {

      console.log(err);
    });



};

exports.postDeleteProduct = (req, res, next) => {

  const prodId = req.body.productId;

  Product.remove( {_id: prodId,userId:req.user._id} )
  .then(result=>{

    console.log("product wad deleted successfully..............");
    res.redirect('/admin/products');
  })
  .catch(err=>{
      console.log(err);
  });
};
