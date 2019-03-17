var express= require('express');
var path=require('path');
var bodyParser=require('body-parser');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'health'
});
var app = express();
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'routes', 'Main_Screen.html'));
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});

app.post('/login', function(req, res)
{
   //make select request
   //resturn response with results
   connection.query('SELECT * from users', function(err, result){
      if(err)
      {
          res.status(500).send(err.toString());
      }
      else
      {
          //res.send(JSON.stringify(result.rows));
		  print("HELLO")
      }
   });
});

var port = 8081;
app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});
