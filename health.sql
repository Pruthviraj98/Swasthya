use health;
create table customer(id int(5), name varchar(20), address varchar(255), phno bigint(10), pass varchar(10));
select * from customer;
drop table users;
CREATE TABLE users (
 id int(11) NOT NULL AUTO_INCREMENT,
 first_name varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 last_name varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 email varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 pass varchar(255) COLLATE utf8_unicode_ci NOT NULL,
 created datetime NOT NULL,
 modified datetime NOT NULL,
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
drop table users;
create TABLE users (
 id int(11) AUTO_INCREMENT,
 name varchar(100),
 email varchar(100),
 pass varchar(255),
 phno bigint(10),
 primary key(id)
);
select * from users;
INSERT into users (name, email, pass, phno) values("root", "root@123", "password", "8754487085");
drop table diseases;
create table diseases(
	name varchar(100),
    disease varchar(100),
    symptoms varchar(100),
    date_of_log varchar (100),
    date_of_cure varchar(100),
    hospital_visited varchar(100),
    phno bigint(10),
    steps_taken text(20000)
);
select * from diseases;