const express = require('express');
const route = express.Router();
const Post = require('../models/Post');

route.get('/', (req, res) => {
    res.send('Posts page');
});

route.post('/post', (req, res) => {
    console.log(req.body);
});
module.exports = route;