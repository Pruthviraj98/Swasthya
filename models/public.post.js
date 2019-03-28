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
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const options = {
    resources: 'usable',
    runScripts: 'dangerously',
};

var Post = {};

Post.showPost = function(id, res) {
    var sql1 = "SELECT * FROM posts WHERE id = "+id;
    db.query(sql1, function(err1, result1) {
        if (err1) throw err1;
        var sql2 = "SELECT * FROM users WHERE id = "+result1[0].userid;
        db.query(sql2, function(err2, result2) {
            if (err2) throw err2;
            JSDOM.fromFile("./views/post.html", options).then(dom => {
                dom.window.document.getElementById("title").innerHTML = result1[0].title;
                dom.window.document.getElementById("user").innerHTML = "<a href=/user/" + result2[0].name + ">" + result2[0].name + "</a>";
                dom.window.document.getElementById("body").innerHTML = result1[0].body;
                res.send(dom.serialize());
            }).catch(function(rej) {
                console.log(rej);
            });
        })
    });
};

Post.submit = function(res) {
    JSDOM.fromFile("./views/submit.html", options).then(dom => {
        res.send(dom.serialize());
    }).catch(function(rej) {
        console.log(rej);
    });
};

Post.newPost = function(title, user, pass, body, res) {
    db.query("SELECT SHA2('"+pass+"', 512) AS sha", function(err, result0) {
        if (err) throw err;
        var pass_sha512 = result0[0].sha;
        var sql = "SELECT * FROM users WHERE name = '"+user+"'";
        db.query(sql, function(err, result1) {
            if (err) throw err;
//            if (pass_sha512 == result1[0].pass_sha512) {
                db.query("SELECT COUNT(*) AS count FROM posts", function(err, result2) {
                    if (err) throw err;
                    var id = result2[0].count;
                    var sql = "INSERT INTO posts VALUES ("+id+",'"+title+"','"+body+"',"+result1[0].id+")";
                    //console.log(sql);
                    db.query(sql, function(err, result3) {
                        if (err) throw err;
                        //res.send("Successfully posted!");
                        JSDOM.fromFile("./views/success.html", options).then(dom => {
                            res.send(dom.serialize());
                        }).catch(function(rej) {
                            console.log(rej);
                        });
                    });
                });
            // } else {
            //     JSDOM.fromFile("./views/submit.html", options).then(dom => {
            //         res.send(dom.serialize());
            //     }).catch(function(rej) {
            //         console.log(rej);
            //     });
            // }
        });
    })
};

module.exports = Post;
