/**
 * 
 */

var http = require('http');
var url = require('url');
var fs = require('fs'); 

var dt = require('./mymodule');

console.log('Node version is: ' + process.version);

var serverhttp = http.createServer(function (request, response) {
	var q = url.parse(request.url, true);
	var filename = "." + q.pathname;
	console.log("Url aufgerufen : " + filename)
	fs.readFile('index.html', function(err, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write("The date and time are currently: " + dt.myDateTime() + "<br>");
		response.write(request.url + "<br>");
		var q = url.parse(request.url, true).query;
		var txt = q.year + " " + q.month;
		response.write(txt+"<br>");
		response.write(data);
		response.end('Hello World!'+ "<br>");
	});	
}).listen(3777);

serverhttp.on('error', function (e) {
	  // Handle your error here
	  console.log(e);
	});

var server2 = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('Hello World!'+ "<br>");
}).listen(5430);

server2.on('error', function (e) {
	  // Handle your error here
	  console.log(e);
	});
