/*
 * Skript greift über Google Chromium auf Webseiten zu
 * 
 */

/* notwendige Module */
const Puppeteer = require('puppeteer');
const CREDS = require('./creds');		// eigentlich kein Modul, sondern nur Filezugriff
const fs = require('fs');
const jayson = require('jayson');

/* abgeänderte Funktionen */
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

/* Beginn des Programms */

/* Initialisierung */
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

/* Jetzt die eigentlichen asynchronen Engines, Routinen darstellen */


//create a server
var server = jayson.server({
add: function(args, callback) {
 callback(null, args[0] + args[1]);
}
});

server.http().listen(3000);

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

getPic();



