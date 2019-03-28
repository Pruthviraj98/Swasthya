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

var User = {};

User.renderPage = function(name, res) {
    var sql = "SELECT * FROM users WHERE name = '"+name+"'";
    db.query(sql, function(err, result) {
        if (err) throw err;
        var userid = result[0].id;
        db.query("SELECT COUNT(*) AS count FROM posts", function(errCount, rCount) {
            if (errCount) throw errCount;
            var id = rCount[0].count - 1;
            JSDOM.fromFile("./views/user.html", options).then(dom => {
                dom.window.document.getElementById("username").innerHTML = result[0].name;
                dom.window.document.getElementById("email").innerHTML = result[0].email;
                if (id >= 0) userPostsHelper(dom, id, name, userid, res);
                else res.send(dom.serialize());
            }).catch(function(rej) {
                console.log(rej);
            });
        });
    });
};

function userPostsHelper(dom, id, name, userid, res) {
    var sqlPost = "SELECT * FROM posts WHERE id = "+id;
    db.query(sqlPost, function(errPost, rPost) {
    if (errPost) throw errPost;
        if (rPost[0].userid == userid) {
            dom.window.document.getElementById("content").innerHTML += "<h2><a href='/post/"+id+"'>" + rPost[0].title + "</a></h2>";
            dom.window.document.getElementById("content").innerHTML += "<a href='/user/"+name+"'>" + name + "</a><hr>";
        }
        if (id == 0) res.send(dom.serialize());
        else userPostsHelper(dom, id-1, name, userid, res);
    });
}

User.register = function(res) {
    JSDOM.fromFile("./views/register.html", options).then(dom => {
        res.send(dom.serialize());
    }).catch(function(rej) {
        console.log(rej);
    });
};

User.newUser = function(name, email, pass, res) {
    db.query("SELECT COUNT(*) AS count FROM users", function(err, result) {
        if (err) throw err;
        var id = result[0].count;
        db.query("SELECT SHA2('"+pass+"', 512) AS sha", function(err, result) {
            if (err) throw err;
            var pass_sha512 = result[0].sha;
            var sql = "INSERT INTO users VALUES ("+id+",'"+name+"','"+email+"','"+pass_sha512+"')";
            db.query(sql, function(err, result) {
                if (err) throw err;
                //res.send("Successfully registered!")
                JSDOM.fromFile("./views/success.html", options).then(dom => {
                    res.send(dom.serialize());
                }).catch(function(rej) {
                    console.log(rej);
                });
            });
        })
    });
}

module.exports = User;
