
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'forumdb'
});

var Post = {};

Post.getInfo = function(id, res) {
    var sql = "SELECT * FROM posts WHERE id = "+id;
    db.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result[0]);
    });
};

Post.newPost = function(title, body, userid, pass, res) {
    db.query("SELECT COUNT(*) AS count FROM posts", function(err, result) {
        if (err) throw err;
        var id = result[0].count;
        var sql = "INSERT INTO posts VALUES ("+id+",'"+title+"','"+body+"',"+userid+")";
        db.query(sql, function(err, result) {
            if (err) throw err;
            res.send("Successfully added one post to database.")
        });
    });
};

Post.editPost = function(id, body, userid, pass, res) {
    var sql = "UPDATE posts SET body = '"+body+"' WHERE id = "+id;
    db.query(sql, function(err, result) {
        res.send("Successfully edited one post.");
    });
};

Post.deletePost = function(id, userid, pass, res) {
    var sql = "DELETE FROM posts WHERE id = "+name;
    db.query(sql, function(err, result) {
        if (err) throw err;
        res.send("Successfully deleted one user.");
    });
};

Post.getAll = function(res) {
    var sql = "SELECT * FROM posts";
    db.query(sql, function(err, result) {
        if (err) throw err;
        res.send(result);
    });
};

module.exports = Post;
