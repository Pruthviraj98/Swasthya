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

                app.engine('html', engines.mustache);
                app.set('./', 'html');
			if (request.session.loggedin) {
					response.redirect('login_reg');
			}
		});
	} else {
		response.send('Please enter Username and Password!');
	}
});

app.get('/login', function(request, response) {
//  connection.query('Select * from diseases where ')
if(request.session.loggedin==true){
	response.render("home.html", {name:request.session.username});
}else{
  response.send("ERROR 404 login first");
}
});


app.get('/login_reg', function(request, response) {
//  connection.query('Select * from diseases where ')
if(request.session.loggedin==true){
	response.render("home.html", {name:request.session.username});
}
});

app.post('/donate', function(request, response){
  response.render('donatePage.html');
});

app.post('/donateItems', function(request, response){
  var itemType=request.body.itemType;
  var itemName=request.body.itemName;
  var isExpiry=request.body.itemExp;
  var name=request.session.username;
  var address=request.body.address;
  var situation=request.body.situation;

  connection.query('Insert into donation (itemType, itemName, isExpiry, name, address, situation) values(?,?,?,?,?,?)',[itemType, itemName, isExpiry, name, address, situation], function(err, results, fields){
          if(!err){
          response.render('Sucesspage.html', {itype: itemType});
        }else{
          console.log(err)
        }
  });
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

  request.session.diseases=diseases;
  request.session.symptoms=symptoms;
  request.session.date_of_log=date_log;
  request.session.date_of_cure=date_cure;
  request.session.hospitals=hospitals;
  request.session.steps=steps_taken;
  request.session.phno=phno;


//'INSERT into users (name, pass, email, phno) values (?, ?, ?, ?)', [username, password, email, phno]
  connection.query('INSERT into diseases (name, disease, symptoms, date_of_log, date_of_cure, hospital_visited, phno, steps_taken) values (?, ?, ?, ?, ?, ?, ?, ?)', [name, diseases, symptoms, date_log, date_cure, hospitals, phno, steps_taken], function(err, result, fields){
    console.log(result);
    response.render("mylogs.html", {
      name:request.session.username,
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
  request.session.destroy();
  console.log("I am loggedout");
  response.redirect('/');
});

app.get('/mylog', function(request, response){
  var name=request.session.username;
  console.log(name);
  connection.query("SELECT * from diseases where name= ?",[name], function(err, results, fields){
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




app.post('/getSearchResults', function(request, response){
  var queryy=request.body.quer;
  console.log(request.body.quer)
  connection.query("SELECT * FROM diseases WHERE symptoms LIKE '%"+queryy+"%'", function(err, results, fields){
              if (!err) {
                request.session.S0name=results[0].name;
                request.session.S0diseases=results[0].disease;
                request.session.S0symptoms=results[0].symptoms;
                request.session.S0date_of_log=results[0].date_of_log;
                request.session.S0date_of_cure=results[0].date_of_cure;
                request.session.S0hospitals=results[0].hospital_visited;
                request.session.S0steps=results[0].steps_taken;
                request.session.S0phno=results[0].phno;

                request.session.S1name=results[1].name;
                request.session.S1diseases=results[1].disease;
                request.session.S1symptoms=results[1].symptoms;
                request.session.S1date_of_log=results[1].date_of_log;
                request.session.S1date_of_cure=results[1].date_of_cure;
                request.session.S1hospitals=results[1].hospital_visited;
                request.session.S1steps=results[1].steps_taken;
                request.session.S1phno=results[1].phno;

                request.session.S2name=results[2].name;
                request.session.S2diseases=results[2].disease;
                request.session.S2symptoms=results[2].symptoms;
                request.session.S2date_of_log=results[2].date_of_log;
                request.session.S2date_of_cure=results[2].date_of_cure;
                request.session.S2hospitals=results[2].hospital_visited;
                request.session.S2steps=results[2].steps_taken;
                request.session.S2phno=results[2].phno;

                request.session.S3name=results[3].name;
                request.session.S3diseases=results[3].disease;
                request.session.S3symptoms=results[3].symptoms;
                request.session.S3date_of_log=results[3].date_of_log;
                request.session.S3date_of_cure=results[3].date_of_cure;
                request.session.S3hospitals=results[3].hospital_visited;
                request.session.S3steps=results[3].steps_taken;
                request.session.S3phno=results[3].phno;

                request.session.S4name=results[4].name;
                request.session.S4diseases=results[4].disease;
                request.session.S4symptoms=results[4].symptoms;
                request.session.S4date_of_log=results[4].date_of_log;
                request.session.S4date_of_cure=results[4].date_of_cure;
                request.session.S4hospitals=results[4].hospital_visited;
                request.session.S4steps=results[4].steps_taken;
                request.session.S4phno=results[4].phno;

                    response.render('searchResults.html', {
                      name1:request.session.S0name,
                      symptoms1:request.session.S0symptoms,
                      date_log1:request.session.S0date_of_log,
                      date_cure1:request.session.S0date_of_cure,
                      hospitals1:request.session.S0hospitals,
                      steps1:request.session.S0steps,
                      phno1:request.session.S0phno,
                      diseases1:request.session.S0diseases,

                      name2:request.session.S1name,
                      symptoms2:request.session.S1symptoms,
                      date_log2:request.session.S1date_of_log,
                      date_cure2:request.session.S1date_of_cure,
                      hospitals2:request.session.S1hospitals,
                      steps2:request.session.S1steps,
                      phno2:request.session.S1phno,
                      diseases2:request.session.S1diseases,

                      name3:request.session.S2name,
                      symptoms3:request.session.S2symptoms,
                      date_log3:request.session.S2date_of_log,
                      date_cure3:request.session.S2date_of_cure,
                      hospitals3:request.session.S2hospitals,
                      steps3:request.session.S2steps,
                      phno3:request.session.S2phno,
                      diseases3:request.session.S2diseases,

                      name4:request.session.S3name,
                      symptoms4:request.session.S3symptoms,
                      date_log4:request.session.S3date_of_log,
                      date_cure4:request.session.S3date_of_cure,
                      hospitals4:request.session.S3hospitals,
                      steps4:request.session.S3steps,
                      phno4:request.session.S3phno,
                      diseases4:request.session.S3diseases,

                      name5:request.session.S4name,
                      symptoms5:request.session.S4symptoms,
                      date_log5:request.session.S4date_of_log,
                      date_cure5:request.session.S4date_of_cure,
                      hospitals5:request.session.S4hospitals,
                      steps5:request.session.S4steps,
                      phno5:request.session.S4phno,
                      diseases5:request.session.S4diseases,
                    });
//                  	response.json(results);
          		} else {
          			console.log('Results not found.');
          		}
            });
  connection.end();
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
