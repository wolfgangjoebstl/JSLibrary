/**
 * 
 */

var http = require('http');
var url = require('url');
var fs = require('fs'); 

var dt = require('./mymodule');

console.log('Node version is: ' + process.version);

http.createServer(function (req, res) {
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	console.log("Url aufgerufen : " + filename)
	fs.readFile('index.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("The date and time are currently: " + dt.myDateTime() + "<br>");
		res.write(req.url + "<br>");
		var q = url.parse(req.url, true).query;
		var txt = q.year + " " + q.month;
		res.write(txt+"<br>");
		res.write(data);
		res.end('Hello World!'+ "<br>");
	});	
}).listen(8080);

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('Hello World!'+ "<br>");
}).listen(5432);

