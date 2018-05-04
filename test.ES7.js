/*
 * Skript greift über Google Chromium auf Webseiten zu
 * 
 */

/* 
 * notwendige Module 
 * 
 */

const Puppeteer = require('puppeteer');

const CREDS = require('./creds');		// eigentlich kein Modul, sondern nur Filezugriff

var os = require('os');
const fs = require('fs');
const find = require('find-process');

const jayson = require('jayson');
var myParser = require('body-parser');
var connect = require('connect');
var express = require('express');

var http = require('http');


/* 
 * abgeänderte Funktionen 
 * 
 */

const mkdirSync = function (dirPath) {
	try {
	    fs.mkdirSync(dirPath)
	} catch (err) {
	    if (err.code !== 'EEXIST') throw err
	}
}

const puppeteer = Puppeteer.launch({
    args: [`--remote-debugging-port=9220`, '--no-sandbox', '--disable-setuid-sandbox'],
    headless: false
});

/* **********************************************************************************
 * 
 * Beginn des Programms 
 * 
 */

/* ==========================================================================
 *  
 * Initialisierung 
 * 
 */

console.log('Node version is: ' + process.version);
console.log(require.resolve('puppeteer'));

/* Testen ob Async and Await bereits vom Browser oder node.js unterstützt werden */
let asyncawait = true;
try {
  new Function('async function test(){await 1}');
} catch (error) {
  asyncawait = false;
  console.log('Error on async and await');
}
if (asyncawait)   console.log('Cool async and await is supported');

/* Anlegen der notwendigen Verzeichnisse, nicht asynchron gemacht da bereits gleich benötigt */
mkdirSync('./screenshots');

/* Zum Spass hier asynchron implementiert */
fs.mkdir('./screenshots', function (err) {
    if (err.code !== 'EEXIST') {
        return console.log('failed to write directory', err);
    }
    // eigentlich ist hier das mkdir fertig
    console.log("Directory really ready from async mkdir call.");
});
console.log("Yeap");
let status = fs.existsSync('./screenshots');
// und hier noch nicht, andernfalls Callback hell :-)
console.log("Directory ready : "+status);

/* ================================================================================ 
 * 
 * 
 * Jetzt die eigentlichen asynchronen Engines, Routinen darstellen 
 * 
 */

//var app = connect();
var app = express();

//create a jayson server
var server = jayson.server({
add: function(args, callback) {
 callback(null, args[0] + args[1]);
}
});

//parse request body before the jayson middleware
//respond to all requests
/*app.use(function(req, res){
    console.log('=============================================================================================================');
    console.log('Jayson Server request:');
    console.log(req);
    console.log('Jayson Server request received.');
    console.log('=============================================================================================================');
    const { headers, method, url } = req;
    console.log(method + ' with ' + url);
    console.log(headers);
    //obj = JSON.parse(req);
    //console.log(obj.count);    
    res.end('Hello from Connect!\n');
});*/

app.use(myParser.json());
app.use(myParser.urlencoded({extended : true}));
	
app.post("/api", function(request, response) {
    const { headers, method, url } = request;
    console.log(method + ' with ' + url);
    console.log(headers);
    console.log(request.body); //This prints the JSON document received (if it is a JSON document)
    //var result = JSON.parse(request.body);
    //console.log(result);
    //response.send("You just called the post method at '/api'!\n");
    response.json({id:request.body.id, result: "New movie created." });
});

app.get("/api", function(request, response) {
    const { headers, method, url } = request;
    console.log(method + ' with ' + url);
    console.log(headers);
    console.log(request.body); //This prints the JSON document received (if it is a JSON document)
    response.send("You just called the get method at '/api'!\n");
});

app.listen(3777);


/* var serverresult = server.http().listen(3777, function() {
  console.log('Jayson Server listening on http://localhost:3777');
}); 

serverresult.on('error', function (e) {
	  // Handle your error here
	  console.log('Jayson Server error : ' + e);
	});
*/

//create a http server

var serverhttp = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
    console.log('=============================================================================================================');
    console.log('HTTP Server request received:');
    console.log(req);
}).listen(80);
serverhttp.on('error', function (e) {
	  // Handle your error here
	  console.log('HTTP Server error ' + e);
	});



// crawl with chromium



async function getPic() {	
  console.log('Launch Chromium'+'\n');
  const browser = await puppeteer;
  console.log('newPage'+"<br>");
  let page1;
  try { 
	  page1 = await browser.newPage();
  } catch (error) {
	  console.log('No Puppeteer newPage: '+error);	  
  }
  console.log('gotoGoogle and make a photo on screenshots:');
  await page1.goto('https://google.com');
  await page1.setViewport({width: 1000, height: 500})
  await page1.screenshot({path: 'screenshots/google.png'});
  //await page1.close()

  console.log('gotoGithub and make a photo on screenshots');
  let page2 = await browser.newPage();
  await page2.goto('https://github.com');
  await page2.screenshot({ path: 'screenshots/github.png' })
  
  let pages = await browser.pages();
  //console.log(pages);
  //console.log(pages.map(page => page.url()))
  //console.log(pages.map((page) => {return page}))
  console.log(pages.length + " Seiten gefunden")
  for (entry of pages) {
	  console.log("-------------------------------------------");
	  console.log(entry.url());
  }
  
  await page2.goto('https://github.com/login');
  
  /* dom element selectors, starting with # this is an id selector
   * in original code it is written like: 
   * <input name="login" id="login_field" class="form-control input-block" tabindex="1" autocapitalize="off" autocorrect="off" autofocus="autofocus" type="text">
   */
  const USERNAME_SELECTOR = '#login_field';
  const PASSWORD_SELECTOR = '#password';
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

  await page2.click(USERNAME_SELECTOR);
  await page2.keyboard.type(CREDS.username);
  
  
  await browser.close();
};

/* ================================================================================ 
 * 
 * und die Routinen die eine nach der anderen abgearbeitet werden
 */

//getPic();

var findtag="node";
find('name', findtag)
  .then(function (list) {
    console.log('there are %s process(es) with '+findtag+' in name.', list.length);
    console.log(list);
  })

var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
}); 




