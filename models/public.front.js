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

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const options = {
    resources: 'usable',
    runScripts: 'dangerously',
};

var Front = {};

/*
Front.frontPage = function(res) {
    db.query("SELECT COUNT(*) AS count FROM posts", function(errCount, rCount) {
        if (errCount) throw errCount;
        JSDOM.fromFile("./views/front.html", options).then(dom => {
            for (var id = rCount[0].count - 1; id >= 0; id--) {
                var sqlPost = "SELECT * FROM posts WHERE id = "+id;
                db.query(sqlPost, function(errPost, rPost) {
                    if (errPost) throw errPost;
                    var sqlUser = "SELECT * FROM users WHERE id = "+rPost[0].userid;
                    db.query(sqlUser, function(errUser, rUser) {
                        if (errUser) throw errUser;
                        dom.window.document.getElementById("content").innerHTML += "<h2><a href='/post/"+id+"'>" + rPost[0].title + "</a></h2>";
                        dom.window.document.getElementById("content").innerHTML += "<a href='/user/"+rUser[0].name+"'>" + rUser[0].name + "</a><br>";
                        //console.log(dom.window.document.getElementById("content").innerHTML);
                    })
                });
            }
            res.send(dom.serialize());
        }).catch(function(rej) {
            console.log(rej);
        });
    });
};
*/

Front.frontPage = function(res) {
    db.query("SELECT COUNT(*) AS count FROM posts", function(errCount, rCount) {
        if (errCount) throw errCount;
        var id = rCount[0].count - 1;
        JSDOM.fromFile("./views/front.html", options).then(dom => {
            if (id >= 0) frontPageHelper(dom, id, res);
            else res.send(dom.serialize());
        }).catch(function(rej) {
            console.log(rej);
        });
    });
};

function frontPageHelper(dom, id, res) {
    var sqlPost = "SELECT * FROM posts WHERE id = "+id;
    db.query(sqlPost, function(errPost, rPost) {
        if (errPost) throw errPost;
        var sqlUser = "SELECT * FROM users WHERE id = "+rPost[0].userid;
        db.query(sqlUser, function(errUser, rUser) {
            if (errUser) throw errUser;
            dom.window.document.getElementById("content").innerHTML += "<h2><a href='/post/"+id+"'>" + rPost[0].title + "</a></h2>";
            dom.window.document.getElementById("content").innerHTML += "<a href='/user/"+rUser[0].name+"'>" + rUser[0].name + "</a><hr>";
            if (id == 0) res.send(dom.serialize());
            else frontPageHelper(dom, id-1, res);
        });
    });
}

module.exports = Front;
