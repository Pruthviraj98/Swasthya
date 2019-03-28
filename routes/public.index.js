const express = require('express');
const router = express.Router();
module.exports = router;

const User = require('../models/public.user');
const Post = require('../models/public.post');
const Front = require('../models/public.front');


//Middleware

router.use(function(req, res, next) {
    console.log("Online request made with type " + req.method + " at time " + Date.now());
    next();
});


//Front

router.get('/', function(req, res) {
    Front.frontPage(res);
});


//Users

router.get('/user/:name', function(req, res) {
    User.renderPage(req.params.name, res);
});
router.get('/register', function(req, res) {
    var name = req.query.name;
    var email = req.query.email;
    var pass = req.query.pass;
    var confirm = req.query.confirm;
    if (typeof name === 'undefined' || typeof email === 'undefined' || typeof pass === 'undefined' || pass != confirm) {
        User.register(res);
    } else {
        User.newUser(name, email, pass, res);
    }
});


//Posts

router.get('/post/:id', function(req, res) {
    Post.showPost(req.params.id, res);
});
router.get('/submit', function(req, res) {
    var title = req.query.title;
    var user = req.query.user;
    var pass = req.query.pass;
    var body = req.query.body;
    if (typeof title === 'undefined' || typeof user === 'undefined' || typeof pass === 'undefined' || typeof body === 'undefined') {
        Post.submit(res);
    } else {
        Post.newPost(title, user, pass, body, res);
    }
});
