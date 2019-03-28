const express = require('express');
const router = express.Router();
module.exports = router;

const users = require('./users');
const posts = require('./posts');
const tags = require('./tags');
const database = require('./database');


//Middleware

router.use(function(req, res, next) {
    console.log("API request made with type " + req.method + " at time " + Date.now());
    next();
});


//Users

router.get('/users', users.user_all);
router.post('/users', users.user_new);

router.get('/users/:name', users.user_get);
router.put('/users/:name', users.user_update);
router.delete('/users/:name', users.user_delete);


//Posts

router.get('/posts', posts.post_all);
router.post('/posts', posts.post_new);

router.get('/posts/:id', posts.post_get);
router.put('/posts/:id', posts.post_edit);
router.delete('/posts/:id', posts.post_delete);


//Tags

router.get('/tags', tags.tag_all);
router.post('/tags', tags.tag_new);

router.get('/tags/:name', tags.tag_get);
router.put('/tags/:name', tags.tag_update);
router.delete('/tags/:name', tags.tag_delete);


//Database
