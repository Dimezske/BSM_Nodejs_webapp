const express = require('express');
const route = express.Router();
const Post = require('../models/Post');

route.get('/', (req, res) => {
    res.send('users page');
});
route.get('/admin', (req, res) => {
    console.log(req.body);
});
route.get('/super', (req, res) => {
    console.log('Specific Post');
});

module.exports = route;