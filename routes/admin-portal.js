var express = require('express')
var router = express.Router()
// about page 

router.get('/adminportal', function(req, res) {
    res.render('./pages/admin-portal');
});
