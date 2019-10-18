const express = require('express');
const router = express.Router();
const Product = require('../models/product')
/* GET home page*/
router.get('/', function(req,res,next){
    console.log('MAKE SURE YOU FIND THIS');
    Product.find(function(err,docs){
        console.log('DOCS:', docs);
        if (err) {
          console.log('ERR IS', err);
          return;
        }
        return res.render('shop/index',{ title: 'ShoppingCart', products: docs });
        
    });
    
})
module.exports = router;