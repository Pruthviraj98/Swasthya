// var mysql = require('mysql');
// var express = require('express');
// var session = require('express-session');
// var bodyParser = require('body-parser');
// var path = require('path');
//
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'health'
// });
//
// exports.db_drop = function(req, res) {
//     db.query("DROP DATABASE forumdb", function(err, result) {
//         if (err) throw err;
//         res.json({ message: 'Dropped database forumdb.' });
//     });
// };
//
// exports.db_setup = function(req, res) {
//     var sql1 = "CREATE TABLE users (id INT, name VARCHAR(32), email VARCHAR(64), pass_sha512 VARCHAR(255))";
//     var sql2 = "CREATE TABLE posts (id INT, title VARCHAR(64), body VARCHAR(8192), userid INT)";
//     var sql3 = "CREATE TABLE tags (id INT, name VARCHAR(32))";
//     var sql4 = "CREATE TABLE user_posts (userid INT)";
//     var sql5 = "CREATE TABLE post_tags (postid INT)";
//     db.query(sql1, function(err, result) { if (err) throw err; });
//     db.query(sql2, function(err, result) { if (err) throw err; });
//     db.query(sql3, function(err, result) { if (err) throw err; });
//     db.query(sql4, function(err, result) { if (err) throw err; });
//     db.query(sql5, function(err, result) { if (err) throw err; });
//     res.json({ message: 'Successfully set up database.' });
// }
