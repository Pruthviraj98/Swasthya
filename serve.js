var http=require('http');
var url=require('url');
var fs=require('fs');
var bodyParser = require('body-parser');

http.createServer(function (req, res) {
  // res.writeHead(200, {'Content-Type: text/html'});
  var q=url.parse(req.url, true);
  var filename="./routes/"+q.pathname;
  
  fs.readFile(filename, function(err, data){
    if(err){
      res.writeHead(404, {'Content-Type':'text/html'});
      return res.end('FILE NOT FOUND !! :(');
    }
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8081);
