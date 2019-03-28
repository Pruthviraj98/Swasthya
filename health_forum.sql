
create table donation (
	itemType varchar(20),
    itemName varchar(20),
    isExpiry varchar(20),
    name varchar(20),
    address varchar(100)
);
Insert into donation (itemType, itemName, isExpiry, name, address) values("aaa","aaaa","aaaa","aaaaa","aaaa");
drop table donation;

create table donation (
	itemType varchar(20),
    itemName varchar(20),
    isExpiry varchar(20),
    name varchar(20),
    address varchar(100),
    situation text(200)
);
select * from donation;
CREATE DATABASE forumdb;
use forumdb;
CREATE TABLE users (id INT, name VARCHAR(32), email VARCHAR(64), pass_sha512 VARCHAR(255));
CREATE TABLE posts (id INT, title VARCHAR(64), body VARCHAR(8192), userid INT);
CREATE TABLE tags (id INT, name VARCHAR(32));
CREATE TABLE user_posts (userid INT);
CREATE TABLE post_tags (postid INT);
select * from users;
select * from posts;
use health;
use forumdb;