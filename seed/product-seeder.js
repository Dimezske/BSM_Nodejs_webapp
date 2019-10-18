const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/test",{ useNewUrlParser: true });

var products = [
    new Product({ 
        name: 'Dx1 CubaMoriz Dimension xxx1000xxx Hoodie Jacket',
        imagePath: '../../public/Images/Products/cubamorizdx11000.png',
        price: 120.00,
        description: 'Premium Cotton Fleece Jacket, Planet Resources'
    }),
    new Product({
        name: 'E3 Eylash with Durable Case',
        imagePath: '../../public/Images/Products/e3-eylash.png',
        price: 30.00,
        description: 'nice Pair of Pristine softlayer good stickin eyelashes in E3 Size'
    }),
    new Product({
        name: 'E5 Eylash with Durable Case',
        imagePath: '../../public/Images/Products/e5-eylash.png',
        price: 30.00,
        description: 'nice Pair of Pristine softlayer good stickin eyelashes in E5 Size'
    }),
    new Product({
        name: '16" Best Virgin Brazilian Brunette Hair Closures with Clips',
        imagePath: '../../public/Images/Products/16inch-brazilianclosure-10grade-brunette-prod.png',
        price: 150.00,
        description: 'Virgin ERxtrasoft Druable Silky soft to touch Virgin Bralian Burnete HairClosures comes with Attached Clips'
    })
];
var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err,result){
        done++;
        if (done === products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}