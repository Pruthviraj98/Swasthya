var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'health'
});

var app = express();
app.locals.moment = require('moment');



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var engines = require('consolidate');

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/Main_Screen.html'));
});


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE name = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;

        app.engine('html', engines.mustache);
        app.set('./', 'html');

				response.redirect('login');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.post('/reg', function(request, response) {
	var username = request.body.username;
	var password = request.body.pass1;
	var email=request.body.email;
	var phno=request.body.phno;

	if (username && password) {
		connection.query('INSERT into users (name, pass, email, phno) values (?, ?, ?, ?)', [username, password, email, phno], function(error, results, fields) {
				request.session.loggedin = true;
				request.session.username = username;

			if (request.session.loggedin) {
					response.redirect('login');
			}
				response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/login', function(request, response) {
//  connection.query('Select * from diseases where ')
	response.render("home.html", {name:request.session.username});
});

app.post('/new_log', function(request, response){
  var name=request.session.username;
  var diseases=request.body.diseases;
  var hospitals=request.body.hospitals;
  var date_log=new Date(Date.now()).toLocaleString();
  var date_cure=request.body.date_cure;
  var steps_taken=request.body.steps;
  var symptoms=request.body.symptoms;
  var phno=request.body.phno;
//'INSERT into users (name, pass, email, phno) values (?, ?, ?, ?)', [username, password, email, phno]
  connection.query('INSERT into diseases (name, disease, symptoms, date_of_log, date_of_cure, hospital_visited, phno, steps_taken) values (?, ?, ?, ?, ?, ?, ?, ?)', [name, diseases, symptoms, date_log, date_cure, hospitals, phno, steps_taken], function(err, result, fields){
    console.log(result);
    response.render("mylogs.html", {
      name:name,
      symptoms:symptoms,
      date_log:date_log,
      date_cure:date_cure,
      hospitals:hospitals,
      steps:steps_taken,
      phno:phno,
      diseases:diseases
    });
});
});

app.post('/update_log', function(request, response){
    var name=request.session.username;
    request.session.date_of_log=Date.now();
//    request.session.date_of_cure=request.body.date_cure;
    request.session.steps=request.body.steps_taken;
    connection.query('Update disease set date_of_log=?, steps_taken=? where name=?',[request.session.date_of_log, request.session.steps, name], function(err, result, fields){
      response.redirect('mylog');
    });
    response.end();
});

app.post('/route_create', function(request, response){
  response.render('createLog.html');
});
app.post('/logout', function(request, response){
  request.session.loggedin=false;
  console.log("I am loggedout");
  response.redirect('/');
});

app.get('/mylog', function(request, response){
  var name=request.session.username;
  console.log(name);
  connection.query("select * from diseases where name= ?",[name], function(err, results, fields){
    console.log(results);
  request.session.diseases=results[0].disease;
  request.session.symptoms=results[0].symptoms;
  request.session.date_of_log=results[0].date_of_log;
  request.session.date_of_cure=results[0].date_of_cure;
  request.session.hospitals=results[0].hospital_visited;
  request.session.steps=results[0].steps_taken;
  request.session.phno=results[0].phno;

  response.render("mylogs.html", {
    name:name,
    symptoms:request.session.symptoms,
    date_log:request.session.date_of_log,
    date_cure:request.session.date_of_cure,
    hospitals:request.session.hospitals,
    steps:request.session.steps,
    phno:request.session.phno,
    diseases:request.session.diseases
  });
  });
});

// app.get('show_logs', function(request, response){
//   response.render("mylogs.html", {
//     name:request.session.name,
//     symptoms:request.session.symptoms,
//     date_log:request.session.date_of_log,
//     date_cure:request.session.date_of_cure,
//     hospitals:request.session.hospitals,
//     steps:request.session.steps,
//     phno:request.session.phno,
//     diseases:request.session.diseases
//   });
// });

app.listen(3000);
