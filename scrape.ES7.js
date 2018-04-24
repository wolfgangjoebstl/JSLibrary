/**
 * 
 */

'use strict';

const puppeteer = require('puppeteer');

async function getPic() {	
  const browser = await puppeteer.launch();
  //const browser = await puppeteer.launch({headless: false});  // Darstellung im Browser
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.setViewport({width: 1000, height: 500})
  await page.screenshot({path: 'google.png'});

  await browser.close();
  
};

let scrape = async () => {
	  const browser = await puppeteer.launch();	
	  //const browser = await puppeteer.launch({headless: false});
	  const page = await browser.newPage();
	  
	  await page.goto('http://books.toscrape.com/');
	  await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
	  await page.waitFor(1000);

	  const result1 = await page.evaluate(() => {
	        let title = document.querySelector('h1').innerText;
	        let price = document.querySelector('.price_color').innerText;

	        return {
	            title,
	            price
	        }

	  });
	  const result = {title,price};

	  browser.close();
	  return result;

};

let x = function testing (a,b) {
	let title=a; 
	let price=b;
	let result=a*b;
	return {title,price,result}; }

async function helloWorld() {
	  const browser = await puppeteer.launch();
	  //const browser = await puppeteer.launch({headless: false});	  
	  const page = await browser.newPage();

	  await page.goto('https://en.wikipedia.org/wiki/%22Hello,_World!%22_program');

	  const firstPar = await page.$eval('#mw-content-text p', el => el.innerText);

	  console.log(firstPar); // A "Hello, World!" program is a computer program that outputs ...

	  await browser.close();
	}



console.log("Hallo");
console.log(x(3,4));

helloWorld();


/*
scrape().then((value) => {
    console.log("Ergebnis :"+value); // Success!
});
*/
//getPic();
console.log("Auf Wiedersehen");

